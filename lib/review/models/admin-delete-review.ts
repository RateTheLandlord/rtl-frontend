import sql from '@/lib/db'
import { Review } from '@/util/interfaces/interfaces'

export async function getDeleted(): Promise<Review[]> {
	const reviews = await sql<
		Review[]
	>`SELECT * FROM review WHERE delete_date IS NOT NULL;`
	return reviews
}

export async function deleteReview(id: number): Promise<boolean> {
	await sql`DELETE
				FROM review
				WHERE ID = ${id};`
	return true
}
