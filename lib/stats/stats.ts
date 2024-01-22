import dayjs from 'dayjs'
import sql from '../db'

type StatsQuery = {
	startDate?: string
	groupBy?: string
}

export async function get({ startDate, groupBy }: StatsQuery): Promise<any> {
	const DEFAULT_START = dayjs(new Date())
		.subtract(7, 'days')
		.format('YYYY-MM-DD')
	const dateRange = startDate
		? `'${dayjs(startDate).format('YYYY-MM-DD')}'`
		: `'${DEFAULT_START}'`

	const reviewsStatistics = await getReviewStatistics(dateRange)
	const reviewByDate = await getReviewByDate(dateRange)
	const formattedReviews = reviewsStatistics.map((row) => ({
		date: row.date,
		country_codes: row.country_codes || {},
		cities: row.cities || {},
		state: row.states || {},
		zip: row.zips || {},
	}))

	const detailed_stats =
		groupBy === 'month'
			? combineArrays(
					combineObjectsByMonth(formattedReviews),
					combineObjectsByMonth(reviewByDate),
			  )
			: combineArrays(formattedReviews, reviewByDate)

	const total_stats = await getTotalStats()

	return { detailed_stats, total_stats }
}

export async function getReviewStatistics(dateRange: string) {
	return await sql`
	WITH ReviewStats AS (
	  SELECT
		DATE_TRUNC('day', date_added) AS date,
		country_code,
		city,
		state,
		zip,
		COUNT(*) AS review_count
	  FROM
		review
	  WHERE
		date_added BETWEEN ${dateRange} AND NOW() GROUP BY
		date,
		country_code,
		city,
		state,
		zip
	)
	
	SELECT
	  date,
	  jsonb_object_agg(country_code, review_count) AS country_codes,
	  jsonb_object_agg(city, review_count) AS cities,
	  jsonb_object_agg(zip, review_count) AS zips,
	  jsonb_object_agg(state, review_count) AS states
	FROM
	  ReviewStats
	GROUP BY
	  date
	ORDER BY
	  date;
  `
}

export async function getReviewByDate(dateRange: string) {
	return await sql`
    SELECT
		date_trunc('day', date_added) AS date,
		COUNT(*) AS total
	FROM
		review
	WHERE
		date_added BETWEEN ${dateRange} and NOW() GROUP BY
		date
	ORDER BY
		date;
    `
}

export function combineObjectsByMonth(objects) {
	const groupedByMonth = {}

	objects.forEach((obj) => {
		const month = new Date(obj.date).getMonth()
		const year = new Date(obj.date).getFullYear()

		if (!groupedByMonth[month]) {
			groupedByMonth[month] = { ...obj, date: `${year}-${month}` }
		} else {
			groupedByMonth[month].date = `${year}-${month}`
			// Combine values for existing month
			groupedByMonth[month].total =
				Number(groupedByMonth[month].total) + Number(obj.total)

			// Combine country_codes
			if (obj.country_codes) {
				Object.entries(obj.country_codes).forEach(([country, count]) => {
					groupedByMonth[month].country_codes[country] =
						(groupedByMonth[month].country_codes[country] || 0) + count
				})
			}

			// Combine cities
			if (obj.cities) {
				Object.entries(obj.cities).forEach(([city, count]) => {
					groupedByMonth[month].cities[city] =
						(groupedByMonth[month].cities[city] || 0) + count
				})
			}

			// Combine state
			if (obj.states) {
				Object.entries(obj.states).forEach(([state, count]) => {
					groupedByMonth[month].state[state] =
						(groupedByMonth[month].state[state] || 0) + count
				})
			}

			// Combine zip
			if (obj.zips) {
				Object.entries(obj.zips).forEach(([zip, count]) => {
					groupedByMonth[month].zip[zip] =
						(groupedByMonth[month].zip[zip] || 0) + count
				})
			}
		}
	})

	return Object.values(groupedByMonth)
}

export function combineArrays(detailed_stats, reviewsByDate) {
	return detailed_stats.map((reviewStat) => {
		const correspondingReview = reviewsByDate.find(
			(review) =>
				dayjs(review.date).format('YYYY-MM-DD') ===
				dayjs(reviewStat.date).format('YYYY-MM-DD'),
		)
		return { ...reviewStat, ...correspondingReview }
	})
}

export async function getTotalStats(): Promise<any> {
	const getReviewStats = async (
		countryCode: string,
	): Promise<{ total: number; states: { key: string; total: number }[] }> => {
		const totalResult =
			await sql`SELECT COUNT(*) as count FROM review WHERE country_code = ${countryCode}`
		const total_reviews = totalResult[0].count

		const statesResult =
			await sql`SELECT DISTINCT state FROM review WHERE country_code = ${countryCode}`
		const states_list = statesResult.map(({ state }) => state)

		const total_for_states: Array<{ key: string; total: number }> = []

		for (let i = 0; i < states_list.length; i++) {
			const key = states_list[i]
			const total =
				await sql`SELECT COUNT(*) as count FROM review WHERE state = ${states_list[i]}`
			total_for_states.push({ key: key, total: total[0].count })
		}

		return { total: total_reviews, states: total_for_states }
	}

	const distinctCountryCodes =
		await sql`SELECT DISTINCT country_code FROM review`

	const countryStatsPromises = distinctCountryCodes.map(
		async ({ country_code }) => {
			return {
				[country_code]: await getReviewStats(country_code),
			}
		},
	)

	const countryStats = await Promise.all(countryStatsPromises)

	return {
		total_reviews: (await sql`SELECT COUNT(*) as count FROM review`)[0].count,
		countryStats: Object.assign({}, ...countryStats),
	}
}
