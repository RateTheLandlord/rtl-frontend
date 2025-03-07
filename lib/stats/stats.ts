import sql from '../db'
import { CountryStats, TotalStats } from './types'

export async function get(): Promise<{
	total_stats: TotalStats
}> {
	const total_stats = await getTotalStats()

	return { total_stats }
}

async function getTotalStats(): Promise<TotalStats> {
	const getReviewStats = async (
		countryCode: string,
	): Promise<{ total: number; states: { key: string; total: number }[] }> => {
		const totalResult =
			await sql`SELECT COUNT(*) as count FROM review WHERE country_code = ${countryCode}`
		const total_reviews = totalResult[0].count as number

		const statesResult =
			await sql`SELECT DISTINCT state FROM review WHERE country_code = ${countryCode}`
		const states_list = statesResult.map(({ state }) => state as string)

		const total_for_states: { key: string; total: number }[] = []

		for (let i = 0; i < states_list.length; i++) {
			const key = states_list[i]
			const total =
				await sql`SELECT COUNT(*) as count FROM review WHERE state = ${states_list[i]}`
			total_for_states.push({
				key: key,
				total: total[0].count as number,
			})
		}

		return { total: total_reviews, states: total_for_states }
	}

	const distinctCountryCodes =
		await sql`SELECT DISTINCT country_code FROM review`

	const countryStatsPromises = distinctCountryCodes.map(
		async ({ country_code }) => {
			return {
				[country_code]: await getReviewStats(country_code as string),
			}
		},
	)

	const countryStats = await Promise.all(countryStatsPromises)

	return {
		total_reviews: (await sql`SELECT COUNT(*) as count FROM review`)[0]
			.count as number,
		countryStats: Object.assign({}, ...countryStats) as CountryStats,
	}
}
