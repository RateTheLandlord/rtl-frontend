import { AnalyticsResponse } from './models/review'
import sql from '../db'

export type ReviewQuery = {
	search?: string
	state?: string
	country?: string
	city?: string
	zip?: string
}

export async function getTrailingReviews(
	params: ReviewQuery,
): Promise<AnalyticsResponse> {
	const {
		search,
		state,
		country,
		city,
		zip,
	} = params


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

	const today = new Date();
	const ninetyDays = today.setDate(today.getDate() - 90);
	const oneHundredEightyDays = today.setDate(today.getDate() - 180);
	const threeHunderedSixtyDays = today.setDate(today.getDate() - 360);

	const totalReviewsT90 = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
		AND date_added >= ${ninetyDays}
    `
	const totalT90 = totalReviewsT90[0].count

	const totalReviewsT180 = await sql`
	SELECT COUNT(*) as count
	FROM review
	WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
	AND date_added >= ${oneHundredEightyDays}
	`
	const totalT180 = totalReviewsT180[0].count

	const totalReviewsT360 = await sql`
	SELECT COUNT(*) as count
	FROM review
	WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
	AND date_added >= ${threeHunderedSixtyDays}
	`
	const totalT360 = totalReviewsT360[0].count

	// Return AnalyticsResponse object
	return {
		totalReviewsT90: totalT90,
		totalReviewsT180: totalT180,
		totalReviewsT360: totalT360
	}
}

