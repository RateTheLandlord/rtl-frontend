import { publicReviewCondition } from '@/lib/review/publicReviewSql'
import sql from '../db'
import { AnalyticsResponseInterface } from '@/util/interfaces/Interfaces'
import { ReviewQuery, AnalyticsChartResponse, AnalyticsResponse } from './types'

export async function getTrailingReviews(
	params: ReviewQuery,
): Promise<AnalyticsResponse> {
	const { search, state, country, city, zip } = params

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

	type WindowStats = {
		avg_rating: string | number | null
		median_rent: string | number | null
	}

	const [last90, last180, last365] = await sql<WindowStats[]>`
		SELECT stats.avg_rating, stats.median_rent
		FROM (VALUES (90), (180), (365)) AS windows(days)
		CROSS JOIN LATERAL (
			SELECT
				(AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS avg_rating,
				percentile_cont(0.5) WITHIN GROUP (ORDER BY rent) FILTER (WHERE rent > 0) AS median_rent
			FROM review
			WHERE ${publicReviewCondition}
				${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
				AND date_added BETWEEN LOCALTIMESTAMP - windows.days * INTERVAL '1 day'
					AND LOCALTIMESTAMP
		) AS stats
		ORDER BY windows.days
	`

	return {
		avgRatingT90: Math.round(Number(last90.avg_rating)),
		avgRatingT180: Math.round(Number(last180.avg_rating)),
		avgRatingT365: Math.round(Number(last365.avg_rating)),
		medianRentT90: Math.round(Number(last90.median_rent)),
		medianRentT180: Math.round(Number(last180.median_rent)),
		medianRentT365: Math.round(Number(last365.median_rent)),
	}
}

export async function getChartData(
	params: ReviewQuery,
): Promise<AnalyticsChartResponse> {
	const { search, state, country, city, zip } = params

	const searchClause =
		search && search.length > 0
			? sql`AND (r.landlord ILIKE
		  ${'%' + search + '%'}
		  )`
			: sql``

	const stateClause = state
		? sql`AND r.state =
	${state.toUpperCase()}`
		: sql``
	const countryClause = country
		? sql`AND r.country_code =
			${country.toUpperCase()}`
		: sql``
	const cityClause = city
		? sql`AND r.city =
	${city.toUpperCase()}`
		: sql``
	const zipClause = zip
		? sql`AND r.zip =
	${zip.toUpperCase()}`
		: sql``

	const trailingRatingChartData = await sql<AnalyticsResponseInterface[]>`
			WITH date_series AS (
				-- Generate a series of dates for the last 365 days
				SELECT generate_series(
					CURRENT_DATE - INTERVAL '365 days',  -- Start date (365 days ago)
					CURRENT_DATE,                       -- End date (today)
					'1 day'::INTERVAL                   -- Step size (1 day)
				)::DATE AS review_date
			)
			SELECT
				TO_CHAR(ds.review_date, 'Mon, DD YYYY') AS review_date,
				(AVG(r.repair) + AVG(r.health) + AVG(r.stability) + AVG(r.privacy) + AVG(r.respect)) / 5 AS metric
			FROM
				date_series ds
			LEFT JOIN
				review r ON r.date_added >= ds.review_date - INTERVAL '365 days'
						AND r.date_added < ds.review_date + INTERVAL '1 day'
						AND ${publicReviewCondition} ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
			GROUP BY
				ds.review_date
			ORDER BY
				ds.review_date;`

	const trailingRentChartData = await sql<AnalyticsResponseInterface[]>`
			WITH date_series AS (
				-- Generate a series of dates for the last 365 days
				SELECT generate_series(
					CURRENT_DATE - INTERVAL '365 days',  -- Start date (365 days ago)
					CURRENT_DATE,                       -- End date (today)
					'1 day'::INTERVAL                   -- Step size (1 day)
				)::DATE AS review_date
			)
			SELECT
				TO_CHAR(ds.review_date, 'Mon, DD YYYY') AS review_date,
				CASE
					WHEN COUNT(r.rent) >= 3 THEN
						percentile_cont(0.5) WITHIN GROUP (ORDER BY r.rent)
					ELSE
						NULL
				END AS metric
			FROM
				date_series ds
			LEFT JOIN
				review r ON r.date_added >= ds.review_date - INTERVAL '365 days'
						AND r.date_added < ds.review_date + INTERVAL '1 day'
						AND ${publicReviewCondition} ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
			GROUP BY
				ds.review_date
			ORDER BY
				ds.review_date;`

	return {
		avgRatingChartData: trailingRatingChartData,
		medianChartData: trailingRentChartData,
	}
}
