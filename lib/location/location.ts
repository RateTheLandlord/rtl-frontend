import { Options } from '@/util/interfaces/interfaces'
import sql from '../db'

export interface IZipLocations {
	zip: string
	latitude: string
	longitude: string
}

export async function getLocations(
	zipCodes: Array<Options>,
	country_code: string,
): Promise<Array<IZipLocations>> {
	if (zipCodes.length === 0) {
		return []
	} // Return empty array if no zip codes are provided

	// Extract zip code values from the array
	const zipCodeValues = zipCodes.map((zipCode) => zipCode.value)

	if (zipCodeValues.length === 0) {
		return []
	} // Additional check to avoid empty IN clause

	try {
		if (country_code === 'CA') {
			// Execute the query
			const result = await sql`
                        SELECT *
                        FROM ca_location
                        WHERE zip = ANY(${sql.array([zipCodeValues])});
                    `

			// Transform the result to match the IZipLocations type
			const locations: Array<IZipLocations> = await result.map((row: any) => ({
				zip: row.zip,
				latitude: row.latitude,
				longitude: row.longitude,
			}))

			return await locations
		} else {
			// Execute the query
			const result = await sql`
            SELECT *
            FROM us_location
            WHERE zip = ANY(${sql.array([zipCodeValues])});
        `

			// Transform the result to match the IZipLocations type
			const locations: Array<IZipLocations> = await result.map((row: any) => ({
				zip: row.zip,
				latitude: row.latitude,
				longitude: row.longitude,
			}))

			return await locations
		}
	} catch (err) {
		console.error('Error querying database:', err)
		throw err
	}
}
