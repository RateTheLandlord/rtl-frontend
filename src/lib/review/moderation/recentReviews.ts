import type { RecentReviews } from '@/util/interfaces/Interfaces'
import sql from '@/lib/db'

export async function checkForLandlordSpam(landlord: string): Promise<boolean> {
	const recentReviews: { landlord: string }[] = await sql`
		SELECT landlord
		FROM recent_review
		ORDER BY created_at DESC
		LIMIT 25;
	`

	const occurrences = recentReviews.filter(
		(review) =>
			review.landlord.toLocaleUpperCase() === landlord.toLocaleLowerCase(),
	).length

	if (occurrences >= 5) {
		return true
	}

	const recentEntries = recentReviews.slice(0, 2)

	if (
		recentEntries.length === 2 &&
		recentEntries.every(
			(review) =>
				review.landlord.toLocaleUpperCase() === landlord.toLocaleUpperCase(),
		)
	) {
		return true
	}

	return false
}

export async function getRecentReviews(): Promise<Array<RecentReviews>> {
	const recentReviews: RecentReviews[] = await sql`
		SELECT *
		FROM recent_review
		ORDER BY created_at DESC
		LIMIT 25;
	`
	return recentReviews
}

export async function updateRecentReviews(landlord: string) {
	await sql`INSERT INTO recent_review (landlord) VALUES (${landlord});`

	await sql`DELETE FROM recent_review WHERE created_at < (SELECT MIN(created_at) FROM (SELECT created_at FROM recent_review ORDER BY created_at DESC LIMIT 25) AS subquery)`
}
