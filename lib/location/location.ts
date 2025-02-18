import { Options } from '@/util/interfaces/interfaces'
import sql from '../db'
import { IZipLocations } from './types'

export async function getLocations(
	zipCodes: Options[],
	country_code: string,
): Promise<IZipLocations[]> {
	if (zipCodes.length === 0) {
		return []
	} // Return empty array if no zip codes are provided

	// Extract zip code values from the array
	const zipCodeValues = zipCodes
		.map((zipCode) => zipCode.value)
		.map((zipCode) => zipCode.split('-')[0])

	if (zipCodeValues.length === 0) {
		return []
	} // Additional check to avoid empty IN clause

	try {
		if (country_code === 'CA') {
			// Execute the query
			const result: {
				zip: string
				latitude: string
				longitude: string
			}[] = await sql`
						SELECT *
						FROM ca_location
						WHERE zip = ANY(${sql.array([zipCodeValues])});
					`

			// Transform the result to match the IZipLocations type
			const locations: IZipLocations[] = result.map(
				(row: { zip: string; latitude: string; longitude: string }) => ({
					zip: row.zip,
					latitude: row.latitude,
					longitude: row.longitude,
				}),
			)

			return locations
		} else {
			// Execute the query
			const result: {
				zip: string
				latitude: string
				longitude: string
			}[] = await sql`
					SELECT *
					FROM us_location
					WHERE zip = ANY(${sql.array([zipCodeValues])});
				`

			// Transform the result to match the IZipLocations type
			const locations: IZipLocations[] = result.map((row) => ({
				zip: row.zip,
				latitude: row.latitude,
				longitude: row.longitude,
			}))

			return locations
		}
	} catch (err) {
		console.error('Error querying database:', err)
		throw err
	}
}
