import sql from '../../db'
import { UserReview } from '@/util/interfaces/interfaces'
import { ReviewQuery } from '../types/Queries'
import { UserReviewsResponse } from '../types/Responses'

export async function getReviews(
	params: ReviewQuery,
): Promise<UserReviewsResponse> {
	const { search, sort, state, country, city, zip } = params

	const page = Math.max(1, Math.floor(Number(params.page) || 1))
	const limit = Math.min(
		100,
		Math.max(1, Math.floor(Number(params.limit) || 25)),
	)
	const offset = (page - 1) * limit

	const sortOptions = {
		az: { column: sql`landlord`, direction: sql`ASC` },
		za: { column: sql`landlord`, direction: sql`DESC` },
		new: { column: sql`date_added`, direction: sql`DESC` },
		old: { column: sql`date_added`, direction: sql`ASC` },
		high: {
			column: sql`(repair + health + stability + privacy + respect) / 5`,
			direction: sql`DESC`,
		},
		low: {
			column: sql`(repair + health + stability + privacy + respect) / 5`,
			direction: sql`ASC`,
		},
	} as const

	const selectedSort =
		sortOptions[sort as keyof typeof sortOptions] ?? sortOptions.new

	const searchClause =
		typeof search === 'string' && search.trim()
			? sql`AND landlord ILIKE ${`%${search.trim()}%`}`
			: sql``

	const stateClause =
		typeof state === 'string' && state.trim()
			? sql`AND state = ${state.trim().toUpperCase()}`
			: sql``

	const countryClause =
		typeof country === 'string' && country.trim()
			? sql`AND country_code = ${country.trim().toUpperCase()}`
			: sql``

	const cityClause =
		typeof city === 'string' && city.trim()
			? sql`AND city = ${city.trim().toUpperCase()}`
			: sql``

	const zipClause =
		typeof zip === 'string' && zip.trim()
			? sql`AND zip = ${zip.trim().toUpperCase()}`
			: sql``

	const filters = sql`
		WHERE
			(
				flagged = false
				OR (flagged = true AND admin_approved = true)
			)
			AND delete_date IS NULL
			${searchClause}
			${stateClause}
			${countryClause}
			${cityClause}
			${zipClause}
	`

	const reviews = (await sql`
		SELECT
			id,
			landlord,
			country_code,
			city,
			state,
			zip,
			review,
			repair,
			health,
			stability,
			privacy,
			respect,
			date_added,
			admin_edited,
			rent,
			moderation_reason,
			moderator,
			delete_reason,
			deleted_by,
			has_user_code,
      suspicious_reason
		FROM review
		${filters}
		ORDER BY
			${selectedSort.column} ${selectedSort.direction},
			id DESC
		LIMIT ${limit}
		OFFSET ${offset}
	`) as UserReview[]

	const totalResult = await sql`
		SELECT COUNT(*) AS count
		FROM review
		${filters}
	`

	return {
		reviews,
		total: Number(totalResult[0].count),
	}
}
