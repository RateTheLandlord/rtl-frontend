import sql from '../db'
import { Keywords } from '@/util/interfaces/interfaces'
import { createKeyword } from './models/flagged-keywords-data-layer'
import { getFlaggedKeywordsResponse, IResponse } from './types'

export async function getFlaggedKeywords(): Promise<getFlaggedKeywordsResponse> {
	// Fetch Keywords
	const keywords = await sql<Keywords[]>`SELECT *
        FROM keyword_flags;`

	// Fetch Total Number of Landlords
	const totalResult = await sql`SELECT COUNT(*) as count FROM keyword_flags;`
	const total = totalResult[0].count as number

	// Return object
	return {
		keywords,
		total,
	}
}

export async function create(inputKeyword: Keywords): Promise<IResponse> {
	try {
		const landlord = await createKeyword(inputKeyword)
		if (landlord) return { status: 200, message: 'Created Landlord' }
		throw new Error()
	} catch {
		return { status: 500, message: 'Failed to create Landlord' }
	}
}

export async function deleteKeyword(id: number): Promise<IResponse> {
	try {
		const deleteResource = await sql`
			DELETE
			FROM keyword_flags
			WHERE id = ${id};
		`
		if (deleteResource) return { status: 200, message: 'Deleted Keyword' }
		throw new Error()
	} catch {
		return { status: 500, message: 'Failed to Delete Keyword' }
	}
}
