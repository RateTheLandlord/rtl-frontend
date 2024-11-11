import sql from '@/lib/db'
import { SuspiciousLandlord } from '@/util/interfaces/interfaces'

export async function createLandlord(
	suspiciousLandlord: SuspiciousLandlord,
): Promise<SuspiciousLandlord> {
	try {
		suspiciousLandlord.landlord = suspiciousLandlord.landlord
			.substring(0, 150)
			.toLocaleUpperCase()

		const id = await sql<{ id: number }[]>`
					INSERT INTO spam_landlords
					(landlord, message)
					VALUES
					(${suspiciousLandlord.landlord}, ${suspiciousLandlord.message}) RETURNING id;
				`

		suspiciousLandlord.id = await id[0].id

		return suspiciousLandlord
	} catch (e) {
		console.log(e)
		throw e
	}
}

export async function updateLandlord(
	id: number,
	suspiciousLandlord: SuspiciousLandlord,
): Promise<SuspiciousLandlord> {
	await sql`
				UPDATE spam_landlords 
				SET landlord = ${suspiciousLandlord.landlord}, 
				message = ${suspiciousLandlord.message}
				WHERE id = ${id};
			`
	return suspiciousLandlord
}
