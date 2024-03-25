import { Review, ReviewsResponse } from '@/lib/review/models/review'
import { filterReviewWithAI, IResult } from './helpers'
import { checkReviewsForSimilarity } from './review-text-match'
import sql from '../db'
import { getExistingReviewsForLandlord } from '@/lib/review/models/review-data-layer'
import { createReview } from '@/lib/review/models/review-data-layer'
import { updateReview } from '@/lib/review/models/review-data-layer'

export type ReviewQuery = {
	page?: number
	limit?: number
	search?: string
	sort?: 'az' | 'za' | 'new' | 'old' | 'high' | 'low'
	state?: string
	country?: string
	city?: string
	zip?: string
}

export async function getReviews(
	params: ReviewQuery,
): Promise<ReviewsResponse> {
	const {
		page: pageNumber = 1,
		limit: limitParam = 25,
		search,
		sort,
		state,
		country,
		city,
		zip,
	} = params

	const offset = (pageNumber - 1) * limitParam

	let orderBy = sql`id`
	if (sort === 'az' || sort === 'za') {
		orderBy = sql`landlord`
	} else if (sort === 'new' || sort === 'old') {
		orderBy = sql`date_added`
	} else if (sort === 'high' || sort === 'low') {
		orderBy = sql`(repair + health + stability + privacy + respect) / 5`
	}

	const sortOrder =
		sort === 'az' || sort === 'old' || sort === 'low' ? sql`ASC` : sql`DESC`

	const searchClause =
		search && search.length > 0
			? sql`AND (landlord ILIKE
              ${'%' + search + '%'}
              )`
			: sql``

	const stateClause = state
		? sql`AND state =
    ${state.toUpperCase()}`
		: sql``
	const countryClause = country
		? sql`AND country_code =
            ${country.toUpperCase()}`
		: sql``
	const cityClause = city
		? sql`AND city =
    ${city.toUpperCase()}`
		: sql``
	const zipClause = zip
		? sql`AND zip =
    ${zip.toUpperCase()}`
		: sql``

	// Fetch reviews
	const reviews = (await sql`
        SELECT *
        FROM review
        WHERE 1 = 1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
		AND (flagged = false OR (flagged = true AND admin_approved = true))
        ORDER BY ${orderBy} ${sortOrder} LIMIT ${limitParam}
        OFFSET ${offset}
    `) as Array<Review>

	// Fetch total number of reviews
	const totalResult = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
    `
	const total = totalResult[0].count

	// Fetch countries
	const countries = await sql`
        SELECT DISTINCT country_code
        FROM review;
    `
	const countryList = countries.map(({ country_code }) => country_code)

	// Fetch states
	const states = await sql`
        SELECT DISTINCT state
        FROM review
        WHERE 1 = 1 ${countryClause};
    `
	const stateList = states.map(({ state }) => state)

	// Fetch cities
	const cities = await sql`
        SELECT DISTINCT city
        FROM review
        WHERE 1 = 1 ${countryClause} ${stateClause};
    `
	const cityList = cities.map(({ city }) => city)

	// Fetch zips
	const zips = await sql`
        SELECT DISTINCT zip
        FROM review
        WHERE 1 = 1 ${countryClause} ${stateClause} ${cityClause};
    `
	const zipList = zips.map(({ zip }) => zip)

	// Return ReviewsResponse object
	return {
		reviews,
		total,
		countries: countryList,
		states: stateList,
		cities: cityList,
		zips: zipList,
		limit: limitParam,
	}
}

export async function findOne(id: number): Promise<Review[]> {
	return sql<Review[]>`Select *
      FROM review
      WHERE id IN (${id});`
}

export async function create(inputReview: Review): Promise<Review> {
	try {
		const filterResult: IResult = await filterReviewWithAI(inputReview)

		const existingReviewsForLandlord: Review[] =
			await getExistingReviewsForLandlord(inputReview)
		const reviewSpamDetected: boolean = await checkReviewsForSimilarity(
			existingReviewsForLandlord,
			inputReview.review,
		)
		if (reviewSpamDetected) return inputReview // Don't post the review to the DB if we detect spam

		return createReview(inputReview, filterResult) // Hit data layer to create review
	} catch (e) {
		throw e
	}
}

export async function update(id: number, review: Review): Promise<Review> {
	return updateReview(id, review)
}

export async function report(id: number, reason: string): Promise<number> {
	reason.length > 250 ? (reason = `${reason.substring(0, 250)}...`) : reason
	await sql`UPDATE review SET flagged = true, flagged_reason = ${reason}
      WHERE id = ${id} RETURNING id;`

	return id
}

export async function deleteReview(id: number): Promise<boolean> {
	await sql`DELETE
                                   FROM review
                                   WHERE ID = ${id};`

	return true
}

export async function getFlagged(): Promise<Review[]> {
	const reviews = await sql<
		Review[]
	>`SELECT * FROM review WHERE flagged = true;`
	return reviews
}

export async function getLandlords(): Promise<string[]> {
	const landlords = await sql`SELECT DISTINCT landlord FROM review;`
	return landlords.map(({ landlord }) => landlord)
}

export async function getLandlordReviews(landlord: string): Promise<Review[]> {
	landlord = decodeURIComponent(landlord)

	return sql<Review[]>`Select *
      FROM review
      WHERE landlord IN (${landlord}) ORDER BY date_added DESC`
}

export async function getLandlordSuggestions(
	landlord: string,
): Promise<string[]> {
	if (!landlord) return []
	const suggestions = await sql`
    SELECT DISTINCT landlord FROM review WHERE landlord LIKE ${
			'%' + landlord.toLocaleUpperCase() + '%'
		}
    `
	return suggestions.map(({ landlord }) => landlord)
}
