import { DatabaseRow, NameCountMap, NameRecord } from '../types/types'
import sql from '@/lib/db'

export function normalizeCountry(value: string | null | undefined): string {
	return (value ?? '').trim().toUpperCase()
}

export function candidateKey(country: string, name: string): string {
	return `${country}\u0000${name}`
}

/**
 * Loads table rows using tagged template literals and extracts unique names and counts.
 */
export async function loadDatabaseIndexes(country_code: string): Promise<{
	rows: DatabaseRow[]
	nameCounts: NameCountMap
	uniqueRecords: NameRecord[]
}> {
	const rows =
		(await sql`SELECT id, landlord, city, country_code from review WHERE country_code = ${country_code}`) as DatabaseRow[]

	const nameCounts: NameCountMap = new Map()

	for (const row of rows) {
		const name = row.landlord ?? ''
		if (!name.trim()) continue

		const country = normalizeCountry(row.country_code)
		const key = candidateKey(country, name)

		nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1)
	}

	const uniqueRecords = [...nameCounts.keys()].map((key) => {
		const separator = key.indexOf('\u0000')

		return {
			country: key.slice(0, separator),
			name: key.slice(separator + 1),
		}
	})

	return { rows, nameCounts, uniqueRecords }
}
