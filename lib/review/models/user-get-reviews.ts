import sql from '../../db'
import { UserReview } from '@/util/interfaces/interfaces'
import { ReviewQuery } from '../types/Queries'
import { UserReviewsResponse } from '../types/Responses'

export async function getReviews(
	params: ReviewQuery,
): Promise<UserReviewsResponse> {
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
		SELECT 
			id, landlord, country_code, city, state, zip, review, repair, 
			health, stability, privacy, respect, date_added, rent, moderation_reason, has_user_code
		FROM review
		WHERE 1 = 1
			${searchClause}
			${stateClause}
			${countryClause}
			${cityClause}
			${zipClause}
			AND (flagged = false OR (flagged = true AND admin_approved = true))
			AND delete_date IS NULL
		ORDER BY ${orderBy} ${sortOrder}
		LIMIT ${limitParam}
		OFFSET ${offset}
		`) as UserReview[]

	console.log(reviews)

	// Fetch total number of reviews
	const totalResult = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
    `
	const total = totalResult[0].count as number

	// Return ReviewsResponse object
	return {
		reviews,
		total,
	}
}
