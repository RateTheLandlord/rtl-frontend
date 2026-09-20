/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
	loadDatabaseIndexes,
	normalizeCountry,
} from '../landlord-tools/utils/utils'
import { DatabaseRow } from '../landlord-tools/types/types'
import sql from '../db'

// Standard tagged template type interface matching `postgres` / `@vercel/postgres` drivers
type Sql = <T = any>(
	strings: TemplateStringsArray,
	...values: any[]
) => Promise<T[]>

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

type AuditRow = {
	timestamp_utc: string
	id: string | number
	country_code: string
	old_name: string
	new_name: string
	city: string
}
/**
 * Executes the database updates using tagged template `sql` client inside transactions.
 */
export async function executeMergeTransaction(
	payload: MergePayload,
): Promise<MergeResult> {
	const { country, masterName, namesToMerge } = payload

	const { rows } = await loadDatabaseIndexes(country)

	console.log({ rows })

	const rowsToUpdate = rows.filter(
		(row) =>
			normalizeCountry(row.country_code) === country &&
			row.landlord !== null &&
			namesToMerge.includes(row.landlord) &&
			row.landlord !== masterName,
	)

	if (!rowsToUpdate.length) {
		return {
			success: false,
			rowsUpdated: 0,
			message: 'No database rows matched the selection criteria.',
		}
	}

	const auditRows: AuditRow[] = []

	const runMerge = async (tx: Sql) => {
		let totalUpdated = 0
		const rowsByOldName = new Map<string, DatabaseRow[]>()

		for (const row of rowsToUpdate) {
			const oldName = row.landlord ?? ''
			const existing = rowsByOldName.get(oldName) ?? []
			existing.push(row)
			rowsByOldName.set(oldName, existing)
		}

		for (const [oldName, oldRows] of rowsByOldName) {
			const ids = oldRows.map((row) => row.id)

			// Uses tagged template literal syntax with safe parameter bindings
			const result = await tx`
        UPDATE review
        SET landlord = ${masterName}
        WHERE id = ANY(${ids})
          AND landlord = ${oldName}
          AND country_code = ${country}
      `

			totalUpdated +=
				(result as any).count ?? (result as any).length ?? ids.length

			const timestamp = new Date().toISOString()

			for (const row of oldRows) {
				auditRows.push({
					timestamp_utc: timestamp,
					id: row.id,
					country_code: country,
					old_name: oldName,
					new_name: masterName,
					city: row.city ?? '',
				})
			}
		}

		if (totalUpdated !== rowsToUpdate.length) {
			throw new Error(
				`Concurrent modification detected: expected ${rowsToUpdate.length} rows to update, but only ${totalUpdated} matched.`,
			)
		}

		return totalUpdated
	}

	try {
		let totalUpdated = 0

		// Check if client supports `sql.begin` (e.g. postgres.js)
		if (typeof sql.begin === 'function') {
			await sql.begin(async (tx: Sql) => {
				totalUpdated = await runMerge(tx)
			})
		} else {
			// Fallback for drivers relying on standard transaction SQL
			await sql`BEGIN`
			try {
				totalUpdated = await runMerge(sql)
				await sql`COMMIT`
			} catch (err) {
				await sql`ROLLBACK`
				throw err
			}
		}

		return {
			success: true,
			rowsUpdated: totalUpdated,
		}
	} catch (error) {
		return {
			success: false,
			rowsUpdated: 0,
			message: `Database update failed: ${
				error instanceof Error ? error.message : String(error)
			}. Transaction rolled back.`,
		}
	}
}
