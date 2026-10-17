import sql from '../db'

export interface IStateStats {
	total: number
	average: number
	catAverages: {
		avg_repair: number
		avg_health: number
		avg_stability: number
		avg_privacy: number
		avg_respect: number
	}
}

export const getStateStats = async (params: {
	state: string
	country: string
}): Promise<IStateStats> => {
	const state = params.state.toLocaleUpperCase()
	const country = params.country.toLocaleUpperCase()

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
		WHERE state = ${state}
			AND country_code = ${country}
	`

	const total = stats[0].count as number
	const average = Math.round(stats[0].combined_avg as number)

	const catAverages = {
		avg_repair: Math.round(stats[0].avg_repair as number),
		avg_health: Math.round(stats[0].avg_health as number),
		avg_stability: Math.round(stats[0].avg_stability as number),
		avg_privacy: Math.round(stats[0].avg_privacy as number),
		avg_respect: Math.round(stats[0].avg_respect as number),
	}

	return {
		total,
		average,
		catAverages,
	}
}
interface ITopCityStats {
	total: number
	average: number
	city: string
}

export const getTopCitiesStats = async (params: {
	state: string
	country: string
}): Promise<ITopCityStats[]> => {
	const state = params.state.toLocaleUpperCase()
	const country = params.country.toLocaleUpperCase()

	const cities = await sql`
		SELECT
			city,
			COUNT(*) AS count,
			(
				AVG(repair) +
				AVG(health) +
				AVG(stability) +
				AVG(privacy) +
				AVG(respect)
			) / 5 AS combined_avg
		FROM review
		WHERE state = ${state}
			AND country_code = ${country}
		GROUP BY city
		ORDER BY COUNT(*) DESC
		LIMIT 4
	`

	return cities.map((row) => ({
		city: row.city as string,
		total: row.count as number,
		average: Math.round(row.combined_avg as number),
	}))
}
