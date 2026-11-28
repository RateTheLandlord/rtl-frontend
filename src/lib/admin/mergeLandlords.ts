import sql from '@/lib/db'

export type MergePayload = {
	country: string
	masterName: string
	namesToMerge: string[]
}

type MergeResult = {
	success: boolean
	rowsUpdated: number
	message?: string
}

export async function executeMergeTransaction({
	country,
	masterName,
	namesToMerge,
}: MergePayload): Promise<MergeResult> {
	try {
		const { count } = await sql`
			UPDATE review
			SET landlord = ${masterName}
			WHERE country_code = ${country}
				AND landlord = ANY(${namesToMerge}::text[])
				AND landlord <> ${masterName}
		`

		if (count === 0) {
			return {
				success: false,
				rowsUpdated: 0,
				message: 'No database rows matched the selection criteria.',
			}
		}

		console.info('Merged landlord reviews', { rowsUpdated: count })
		return { success: true, rowsUpdated: count }
	} catch {
		console.error('Failed to merge landlord reviews')
		return {
			success: false,
			rowsUpdated: 0,
			message: 'Database update failed. No reviews were merged.',
		}
	}
}
