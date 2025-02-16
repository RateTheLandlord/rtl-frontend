import { Options } from '@/util/interfaces/interfaces'
import sql from '../db'
import { FilterOptions } from './types/review'
import { capitalize } from '@/util/helpers/helper-functions'

export async function filterOptions(
	country?: string,
	state?: string,
	city?: string,
): Promise<FilterOptions> {
	const stateClause = state
		? sql`AND state =
    ${state.toUpperCase()}`
		: sql``
	const countryClause = country
		? sql`AND country_code =
            ${country.toUpperCase()}`
		: sql``
	const cityClause = city
		? sql`AND city =
    ${city.toUpperCase()}`
		: sql``

	// Fetch countries
	const countries = await sql`
        SELECT DISTINCT country_code
        FROM review;
    `
	const countryList = countries.map(
		({ country_code }) => country_code as Options,
	)

	// Fetch cities
	const cities = await sql`
        SELECT DISTINCT city
        FROM review
        WHERE 1 = 1 ${countryClause} ${stateClause};
    `
	const cityList = cities.map(({ city }) => city as string)

	// Fetch zips
	const zips = await sql`
        SELECT DISTINCT zip
        FROM review
        WHERE 1 = 1 ${countryClause} ${stateClause} ${cityClause};
    `
	const zipsExtracted = zips.map(({ zip }) => zip as string)

	const zipList = zipsExtracted.filter((zip) => zip.length > 0)

	const filteredCity = cityList.filter((n) => n)
	const allCityOptions = [
		...new Map(
			filteredCity
				.map((c: string, id: number) => {
					const city = c.toLowerCase().trim()
					return {
						id: id + 1,
						name: city.split(' ').map(capitalize).join(' '),
						value: c.toLowerCase().trim(),
					}
				})
				.map((city) => [city.value, city]),
		).values(),
	]

	allCityOptions.sort((a: Options, b: Options): number =>
		a.name.localeCompare(b.name),
	)

	const seenZips = new Set<string>()
	const allZipOptions = zipList.reduce(
		(acc, z, id) => {
			const zip = z.toUpperCase().replace(/\s+/g, '')
			if (!seenZips.has(zip)) {
				seenZips.add(zip)
				acc.push({
					id: id + 1,
					name: zip,
					value: zip,
				})
			}
			return acc
		},
		[] as { id: number; name: string; value: string }[],
	)

	allZipOptions.sort((a: Options, b: Options): number =>
		a.name.localeCompare(b.name),
	)

	return {
		countries: countryList,
		cities: allCityOptions,
		zips: allZipOptions,
	}
}
