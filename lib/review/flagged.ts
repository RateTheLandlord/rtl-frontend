import { Review } from '@/util/interfaces/interfaces'
import sql from '../db'

export async function getFlagged(): Promise<Review[]> {
	const reviews = await sql<
		Review[]
	>`SELECT * FROM review WHERE flagged = true AND delete_date IS NULL;`
	return reviews
}
