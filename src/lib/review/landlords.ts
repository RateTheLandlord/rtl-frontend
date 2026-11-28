import { Review } from '@/util/interfaces/Interfaces'
import sql from '../db'
import { ILandlordReviews } from './types/Queries'
import { OtherLandlord } from './types/Review'
import { FAILED_TO_RETRIEVE_REVIEWS } from '../auth/constants'

export async function getLandlordReviews(
	landlord: string,
): Promise<ILandlordReviews> {
	landlord = decodeURIComponent(landlord)

	const normalizedLandlord = landlord.toLocaleUpperCase()

	const reviews = await sql<Review[]>`
		SELECT *
		FROM review
		WHERE landlord = ${normalizedLandlord}
			AND (
				flagged = false
				OR (flagged = true AND admin_approved = true)
			)
			AND delete_date IS NULL
		ORDER BY date_added DESC
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
		WHERE landlord = ${normalizedLandlord}
			AND (
				flagged = false
				OR (flagged = true AND admin_approved = true)
			)
			AND delete_date IS NULL
	`

	const total = Number(stats[0].count)

	const roundToOneDecimal = (value: unknown) =>
		Math.round(Number(value) * 10) / 10

	const combinedAvg = roundToOneDecimal(stats[0].combined_avg)

	const catAverages = {
		avg_repair: roundToOneDecimal(stats[0].avg_repair),
		avg_health: roundToOneDecimal(stats[0].avg_health),
		avg_stability: roundToOneDecimal(stats[0].avg_stability),
		avg_respect: roundToOneDecimal(stats[0].avg_respect),
		avg_privacy: roundToOneDecimal(stats[0].avg_privacy),
	}

	return {
		reviews,
		average: combinedAvg,
		total,
		catAverages,
	}
}
export async function getOtherLandlords(
	landlord: string,
): Promise<OtherLandlord[]> {
	const topCity = await sql`
		SELECT
		city,
		COUNT(*) as count,
		MAX(date_added)
		FROM review 
		WHERE landlord = ${landlord.toLocaleUpperCase()}
		GROUP BY city
		ORDER BY COUNT(*) DESC, MAX(date_added) DESC
		LIMIT 1;
		`

	const otherLandlords = await sql<OtherLandlord[]>`
		SELECT
			landlord as name,
			(AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS avgrating,
			COUNT(*) as ReviewCount
		FROM review
		WHERE city = ${topCity[0].city as string}
		AND landlord != ${landlord.toLocaleUpperCase()}
		GROUP BY landlord
		ORDER BY RANDOM()
		LIMIT 10;
		`
	const result = otherLandlords.map((landlord) => {
		return { ...landlord, topCity: topCity[0].city as string }
	})
	return result
}

export type LandlordSuggestion = {
	landlord: string
	state: string
	country_code: string
}

export async function getLandlordSuggestions(
	landlord: string,
): Promise<LandlordSuggestion[]> {
	if (!landlord) return []
	const suggestions = await sql<LandlordSuggestion[]>`
    SELECT DISTINCT landlord, state, country_code FROM review WHERE landlord LIKE ${
			'%' + landlord.toLocaleUpperCase().trim() + '%'
		} AND (
			flagged = false
			OR (flagged = true AND admin_approved = true)
		)
		AND delete_date IS NULL
     ORDER BY landlord ASC
      LIMIT 10
    `

	return suggestions.map((suggestion) => {
		return {
			landlord: suggestion.landlord,
			state: suggestion.state,
			country_code: suggestion.country_code,
		}
	})
}

export async function getLandlords(): Promise<string[]> {
	const landlords = await sql`SELECT DISTINCT landlord FROM review;`
	return landlords.map(({ landlord }) => landlord as string)
}

export async function getExistingReviewsForLandlord(
	inputReview: Review,
): Promise<Review[]> {
	try {
		return await sql<Review[]>`SELECT REVIEW
        FROM review
        WHERE landlord = ${inputReview.landlord.toLocaleUpperCase()}
          AND ZIP = ${inputReview.zip.toLocaleUpperCase()};`
	} catch {
		throw new Error(FAILED_TO_RETRIEVE_REVIEWS)
	}
}
