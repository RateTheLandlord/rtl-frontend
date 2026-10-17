import sql from '../db'
import { CountryStats, TotalStats } from './types'

export async function get(): Promise<{
	total_stats: TotalStats
}> {
	const total_stats = await getTotalStats()

	return { total_stats }
}

async function getTotalStats(): Promise<TotalStats> {
	const rows = await sql`
		SELECT
			country_code,
			state,
			COUNT(*) AS count,
			GROUPING(country_code, state) AS grouping_level
		FROM review
		GROUP BY GROUPING SETS (
			(),
			(country_code),
			(country_code, state)
		)
	`

	let totalReviews = 0
	const countryStats: CountryStats = {}

	for (const row of rows) {
		const count = row.count as number
		const groupingLevel = Number(row.grouping_level)

		if (groupingLevel === 3) {
			totalReviews = count
			continue
		}

		const countryCode = String(row.country_code)

		if (!countryStats[countryCode]) {
			countryStats[countryCode] = {
				total: 0,
				states: [],
			}
		}

		if (groupingLevel === 1) {
			countryStats[countryCode].total = count
			continue
		}

		countryStats[countryCode].states.push({
			key: row.state as string,
			total: count,
		})
	}

	return {
		total_reviews: totalReviews,
		countryStats,
	}
}
