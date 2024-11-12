import sql from '../db'
import { SuspiciousLandlord } from '@/util/interfaces/interfaces'
import {
	createLandlord,
	updateLandlord,
} from './models/suspicious-landlord-data-layer'

export interface IResponse {
	status: number
	message: string
}

export interface GetSuspiciousLandlordResponse {
	landlords: Array<SuspiciousLandlord>
	total: number
}

export async function getSuspiciousLandlords(): Promise<GetSuspiciousLandlordResponse> {
	// Fetch Landlords
	const landlords = await sql<Array<SuspiciousLandlord>>`SELECT *
        FROM spam_landlords;`

	// Fetch Total Number of Landlords
	const totalResult = await sql`SELECT COUNT(*) as count FROM spam_landlords;`
	const total = totalResult[0].count

	// Return object
	return {
		landlords,
		total,
	}
}

export async function getOneSuspiciousLandlord(
	landlord: string,
): Promise<SuspiciousLandlord | boolean> {
	// Fetch Landlords
	const foundLandlord =
		await sql`SELECT * from spam_landlords WHERE landlord = ${landlord.toLocaleUpperCase()} LIMIT 1;`

	if (foundLandlord.length) {
		return foundLandlord[0] as SuspiciousLandlord
	} else {
		return false
	}

	// Return ResourcesResponse object
}

export async function create(
	inputLandlord: SuspiciousLandlord,
): Promise<IResponse> {
	try {
		const landlord = await createLandlord(inputLandlord)
		if (landlord) return { status: 200, message: 'Created Landlord' }
		throw new Error()
	} catch (e) {
		return { status: 500, message: 'Failed to create Landlord' }
	}
}

export async function update(
	id: number,
	landlord: SuspiciousLandlord,
): Promise<IResponse> {
	try {
		const updated = await updateLandlord(id, landlord)
		if (updated) return { status: 200, message: 'Landlord updated' }
		throw new Error()
	} catch (error) {
		return { status: 500, message: 'Failed to Update Landlord' }
	}
}

export async function deleteLandlord(id: number): Promise<IResponse> {
	try {
		const deleteResource = await sql`
			DELETE
			FROM spam_landlords
			WHERE id = ${id};
		`
		if (deleteResource) return { status: 200, message: 'Deleted Landlord' }
		throw new Error()
	} catch (error) {
		return { status: 500, message: 'Failed to Delete Landlord' }
	}
}
