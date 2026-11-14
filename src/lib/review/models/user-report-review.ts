import sql from '@/lib/db'

export async function report(id: number, reason: string): Promise<number> {
	reason = reason.length > 250 ? `${reason.substring(0, 250)}...` : reason
	await sql`UPDATE review SET flagged = true, flagged_reason = ${reason}
      WHERE id = ${id} RETURNING id;`

	return id
}
