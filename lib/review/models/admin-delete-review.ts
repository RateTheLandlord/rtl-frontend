import sql from '@/lib/db'
import { Review } from '@/util/interfaces/interfaces'

export async function getDeleted(): Promise<Review[]> {
	const reviews = await sql<
		Review[]
	>`SELECT * FROM review WHERE delete_date IS NOT NULL;`
	return reviews
}

export async function deleteReview(id: number): Promise<boolean> {
	const deleted = await sql<{ id: number }[]>`
		DELETE FROM review
		WHERE id = ${id}
		RETURNING id;
	`

	return deleted.length > 0
}
