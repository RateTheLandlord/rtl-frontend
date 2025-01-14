import { AnalyticsChartResponse, AnalyticsResponse } from './models/review'
import sql from '../db'
import { AnalyticsResponseInterface } from '@/util/interfaces/interfaces'

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

	const avgRatingT90 = await sql`
	SELECT 
		(AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS combined_avg
	FROM review
	WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
	AND date_added >= ${ninetyDays}`

	const avgT90 = Math.round(avgRatingT90[0].combined_avg)

	const avgRatingT180 = await sql`
	SELECT 
		(AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS combined_avg
	FROM review
	WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
	AND date_added >= ${oneHundredEightyDays}`

	const avgT180 = Math.round(avgRatingT180[0].combined_avg)

	const avgRatingT360 = await sql`
	SELECT 
		(AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS combined_avg
	FROM review
	WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
	AND date_added >= ${threeHunderedSixtyDays}`

	const avgT360 = Math.round(avgRatingT360[0].combined_avg)

	const medianRentT90 = await sql`
	SELECT 
		percentile_cont(0.5) WITHIN GROUP (ORDER BY rent) AS median_rent
	FROM review
	WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
	AND date_added >= ${ninetyDays}
	AND rent > 0`

	const medianT90 = Math.round(medianRentT90[0].median_rent)

	const medianRentT180 = await sql`
	SELECT 
		percentile_cont(0.5) WITHIN GROUP (ORDER BY rent) AS median_rent
	FROM review
	WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
	AND date_added >= ${oneHundredEightyDays}
	AND rent > 0`

	const medianT180 = Math.round(medianRentT180[0].median_rent)

	const medianRentT360 = await sql`
	SELECT 
		percentile_cont(0.5) WITHIN GROUP (ORDER BY rent) AS median_rent
	FROM review
	WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
	AND date_added >= ${threeHunderedSixtyDays}
	AND rent > 0`

	const medianT360 = Math.round(medianRentT360[0].median_rent)

	// Return AnalyticsResponse object
	return {
		totalReviewsT90: totalT90,
		totalReviewsT180: totalT180,
		totalReviewsT360: totalT360,
		avgRatingT90: avgT90,
		avgRatingT180: avgT180,
		avgRatingT360: avgT360,
		medianRentT90: medianT90,
		medianRentT180: medianT180,
		medianRentT360: medianT360
	}
}

export async function getChartData(
	params: ReviewQuery,
): Promise<AnalyticsChartResponse> {
	const {
		search,
		state,
		country,
		city,
		zip,
	} = params

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

	const trailingReviewsChartData = await sql<AnalyticsResponseInterface[]>`
		WITH date_series AS (
			-- Generate a series of dates for the last 360 days
			SELECT generate_series(
				CURRENT_DATE - INTERVAL '360 days',  -- Start date (360 days ago)
				CURRENT_DATE,                       -- End date (today)
				'1 day'::INTERVAL                   -- Step size (1 day)
			)::DATE AS review_date
		)
		SELECT
			TO_CHAR(ds.review_date, 'Mon, DD YYYY') AS review_date,
			COUNT(r.id) AS metric
		FROM
			date_series ds
		LEFT JOIN
			review r ON r.date_added >= ds.review_date - INTERVAL '360 days'
					AND r.date_added < ds.review_date + INTERVAL '1 day'
					AND 1 = 1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
		GROUP BY
			ds.review_date
		ORDER BY
			ds.review_date;`

		const trailingRatingChartData = await sql<AnalyticsResponseInterface[]>`
			WITH date_series AS (
				-- Generate a series of dates for the last 360 days
				SELECT generate_series(
					CURRENT_DATE - INTERVAL '360 days',  -- Start date (360 days ago)
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
				review r ON r.date_added >= ds.review_date - INTERVAL '360 days'
						AND r.date_added < ds.review_date + INTERVAL '1 day'
						AND 1 = 1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
			GROUP BY
				ds.review_date
			ORDER BY
				ds.review_date;`

		const trailingRentChartData = await sql<AnalyticsResponseInterface[]>`
			WITH date_series AS (
				-- Generate a series of dates for the last 360 days
				SELECT generate_series(
					CURRENT_DATE - INTERVAL '360 days',  -- Start date (360 days ago)
					CURRENT_DATE,                       -- End date (today)
					'1 day'::INTERVAL                   -- Step size (1 day)
				)::DATE AS review_date
			)
			SELECT
				TO_CHAR(ds.review_date, 'Mon, DD YYYY') AS review_date,
				percentile_cont(0.5) WITHIN GROUP (ORDER BY r.rent) AS metric
			FROM
				date_series ds
			LEFT JOIN
				review r ON r.date_added >= ds.review_date - INTERVAL '360 days'
						AND r.date_added < ds.review_date + INTERVAL '1 day'
						AND 1 = 1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
			GROUP BY
				ds.review_date
			ORDER BY
				ds.review_date;`

	
	return {
		reviewsChartData: trailingReviewsChartData,
		avgRatingChartData: trailingRatingChartData,
		medianChartData: trailingRentChartData
	}
}