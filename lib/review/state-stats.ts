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
	const { country, state } = params

	const totalResult = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE state = ${state.toLocaleUpperCase()} AND country_code = ${country.toLocaleUpperCase()}
    `
	const total = totalResult[0].count

	const averageByCat = await sql`
        SELECT 
            AVG(repair) AS avg_repair,
            AVG(health) AS avg_health,
            AVG(stability) AS avg_stability,
            AVG(privacy) AS avg_privacy,
            AVG(respect) AS avg_respect
        FROM review
        WHERE state = ${state.toLocaleUpperCase()} AND country_code = ${country.toLocaleUpperCase()}
    `

	const combinedAvgResult = await sql`
        SELECT 
            (AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS combined_avg
        FROM review
        WHERE state = ${state.toLocaleUpperCase()} AND country_code = ${country.toLocaleUpperCase()}
    `
	const average = Math.round(combinedAvgResult[0].combined_avg)

	const catAverages = {
		avg_repair: Math.round(averageByCat[0].avg_repair),
		avg_health: Math.round(averageByCat[0].avg_health),
		avg_stability: Math.round(averageByCat[0].avg_stability),
		avg_respect: Math.round(averageByCat[0].avg_respect),
		avg_privacy: Math.round(averageByCat[0].avg_privacy),
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
	const { state, country } = params

	const cities = await sql`
        SELECT city, COUNT(*) as city_count FROM review WHERE state = ${state.toLocaleUpperCase()} AND country_code = ${country.toLocaleUpperCase()} GROUP BY city ORDER BY city_count DESC LIMIT 4;
    `

	const cityList = cities.map(({ city }) => city)

	const citiesStats: ITopCityStats[] = []

	for (let i = 0; i < cityList.length; i++) {
		const totalResult = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE city = ${cityList[
					i
				].toLocaleUpperCase()} AND state = ${state.toLocaleUpperCase()} AND country_code = ${country.toLocaleUpperCase()};
    `

		const total = totalResult[0].count

		const combinedAvgResult = await sql`
        SELECT 
            (AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS combined_avg
        FROM review
        WHERE city = ${cityList[
					i
				].toLocaleUpperCase()} AND state = ${state.toLocaleUpperCase()} AND country_code = ${country.toLocaleUpperCase()}
    `
		const average = Math.round(combinedAvgResult[0].combined_avg)

		citiesStats.push({
			total,
			average,
			city: cityList[i],
		})
	}
	return citiesStats
}
