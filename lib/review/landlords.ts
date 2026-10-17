import { Review } from '@/util/interfaces/interfaces'
import sql from '../db'
import { ILandlordReviews } from './types/Queries'
import { OtherLandlord } from './types/review'
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
	`

	const total = stats[0].count as number

	const combinedAvg = Math.round(stats[0].combined_avg as number)

	const catAverages = {
		avg_repair: Math.round(stats[0].avg_repair as number),
		avg_health: Math.round(stats[0].avg_health as number),
		avg_stability: Math.round(stats[0].avg_stability as number),
		avg_respect: Math.round(stats[0].avg_respect as number),
		avg_privacy: Math.round(stats[0].avg_privacy as number),
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

export async function getLandlordSuggestions(
	landlord: string,
): Promise<string[]> {
	if (!landlord) return []
	const suggestions = await sql`
    SELECT DISTINCT landlord FROM review WHERE landlord LIKE ${
			'%' + landlord.toLocaleUpperCase() + '%'
		} LIMIT 10
    `
	return suggestions.map(({ landlord }) => landlord as string)
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
