import { Review } from '@/util/interfaces/interfaces'
import sql from '../db'
import { ICityReviews } from './types/review'
import { ICityQuery } from './types/Queries'

export async function getCityReviews(
	params: ICityQuery,
): Promise<ICityReviews> {
	const city = decodeURIComponent(params.city).toLocaleUpperCase()
	const state = decodeURIComponent(params.state).toLocaleUpperCase()
	const countryCode = decodeURIComponent(
		params.country_code,
	).toLocaleUpperCase()
	const offset = params.offset ? params.offset : 0
	const sort = params.sort ? params.sort : 'new'

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

	const reviews = await sql<Review[]>`
		SELECT *
		FROM review
		WHERE city = ${city}
			AND state = ${state}
			AND country_code = ${countryCode}
		ORDER BY ${orderBy} ${sortOrder}
		LIMIT 25
		OFFSET ${offset}
	`

	const stats = await sql`
		SELECT
			COUNT(*) AS count,
			AVG(repair) AS avg_repair,
			AVG(health) AS avg_health,
			AVG(stability) AS avg_stability,
			AVG(privacy) AS avg_privacy,
			AVG(respect) AS avg_respect,
			(
				AVG(repair) +
				AVG(health) +
				AVG(stability) +
				AVG(privacy) +
				AVG(respect)
			) / 5 AS combined_avg
		FROM review
		WHERE city = ${city}
			AND state = ${state}
			AND country_code = ${countryCode}
	`

	const zips = await sql`
		SELECT DISTINCT zip
		FROM review
		WHERE city = ${city}
			AND state = ${state}
			AND country_code = ${countryCode}
	`

	const zipList = zips.map(({ zip }) => zip as string)

	const total = stats[0].count as number
	const average = Math.round(stats[0].combined_avg as number)

	const catAverages = {
		avg_repair: Math.round(stats[0].avg_repair as number),
		avg_health: Math.round(stats[0].avg_health as number),
		avg_stability: Math.round(stats[0].avg_stability as number),
		avg_respect: Math.round(stats[0].avg_respect as number),
		avg_privacy: Math.round(stats[0].avg_privacy as number),
	}

	return {
		reviews,
		average,
		total,
		catAverages,
		zips: zipList,
	}
}
