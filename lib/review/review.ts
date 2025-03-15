import { filterReviewWithAI, IResult } from './helpers'
import {
	checkForLandlordSpam,
	checkReviewsForSimilarity,
	updateRecentReviews,
} from './review-text-match'
import sql from '../db'
import { createReview } from '@/lib/review/models/review-data-layer'
import { updateReview } from '@/lib/review/models/review-data-layer'
import { Review } from '@/util/interfaces/interfaces'
import { ReviewQuery } from './types/Queries'
import { ReviewResponseStatus, ReviewsResponse } from './types/Responses'
import { getExistingReviewsForLandlord } from './landlords'

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
		AND delete_date IS NULL
        ORDER BY ${orderBy} ${sortOrder} LIMIT ${limitParam}
        OFFSET ${offset}
    `) as Review[]

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

export async function create(
	inputReview: Review,
): Promise<ReviewResponseStatus> {
	try {
		const existingReviewsForLandlord: Review[] =
			await getExistingReviewsForLandlord(inputReview)
		const reviewSpamDetected: boolean = checkReviewsForSimilarity(
			existingReviewsForLandlord,
			inputReview.review,
		)

		const landlordSpamDetected: boolean = await checkForLandlordSpam(
			inputReview.landlord,
		)

		// Don't post the review to the DB if we detect spam
		if (reviewSpamDetected || landlordSpamDetected)
			return {
				message:
					'This landlord is currently under spam protection please try again later',
				success: false,
			}

		updateRecentReviews(inputReview.landlord).catch(() =>
			console.error(
				`Error Updating Recent Reviews for ${inputReview.landlord}`,
			),
		)
		if (process.env.NEXT_PUBLIC_ENVIRONMENT == 'development')
			return createReview(inputReview, {
				flagged: false,
				flagged_reason: 'DEV REVIEW',
			}) // Hit data layer to create review

		const filterResult: IResult = await filterReviewWithAI(inputReview)
		return createReview(inputReview, filterResult) // Hit data layer to create review
	} catch {
		throw new Error()
	}
}

export async function update(id: number, review: Review): Promise<Review> {
	return updateReview(id, review)
}

export async function report(id: number, reason: string): Promise<number> {
	reason = reason.length > 250 ? `${reason.substring(0, 250)}...` : reason
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

export async function getDeleted(): Promise<Review[]> {
	const reviews = await sql<
		Review[]
	>`SELECT * FROM review WHERE delete_date IS NOT NULL;`
	return reviews
}

export interface ZipQuery {
	zip: string
	state: string
	country_code: string
}
