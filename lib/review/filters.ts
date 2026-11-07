import { Options } from '@/util/interfaces/interfaces'
import sql from '../db'
import { FilterOptions } from './types/review'
import { capitalize } from '@/util/helpers/helper-functions'

export async function filterOptions(
	country?: string,
	state?: string,
	city?: string,
): Promise<FilterOptions> {
	const stateClause = state ? sql`AND state = ${state.toUpperCase()}` : sql``

	const countryClause = country
		? sql`AND country_code = ${country.toUpperCase()}`
		: sql``

	const cityClause = city ? sql`AND city = ${city.toUpperCase()}` : sql``

	const [countries, cities, zips] = await Promise.all([
		sql`
			SELECT DISTINCT country_code
			FROM review
			WHERE country_code IS NOT NULL;
		`,
		sql`
			SELECT DISTINCT city
			FROM review
			WHERE city IS NOT NULL
			${countryClause}
			${stateClause};
		`,
		sql`
			SELECT DISTINCT zip
			FROM review
			WHERE zip IS NOT NULL
			${countryClause}
			${stateClause}
			${cityClause};
		`,
	])

	const countryList: Options[] = countries
		.map(({ country_code }, index) => {
			const value = String(country_code).trim().toUpperCase()

			return {
				id: index + 1,
				name: value,
				value,
			}
		})
		.filter((option) => option.value.length > 0)

	const filteredCity = cities
		.map(({ city }) => city as string)
		.filter((city) => typeof city === 'string' && city.trim().length > 0)

	const allCityOptions = [
		...new Map(
			filteredCity.map((city, index) => {
				const value = city.toLowerCase().trim()

				return [
					value,
					{
						id: index + 1,
						name: value.split(' ').map(capitalize).join(' '),
						value,
					},
				]
			}),
		).values(),
	]

	allCityOptions.sort((a, b) => a.name.localeCompare(b.name))

	const zipList = zips
		.map(({ zip }) => zip as string | null)
		.filter(
			(zip): zip is string => typeof zip === 'string' && zip.trim().length > 0,
		)

	const seenZips = new Set<string>()

	const allZipOptions = zipList.reduce((acc, value, index) => {
		const zip = value.toUpperCase().replace(/\s+/g, '')

		if (!seenZips.has(zip)) {
			seenZips.add(zip)

			acc.push({
				id: index + 1,
				name: zip,
				value: zip,
			})
		}

		return acc
	}, [] as Options[])

	allZipOptions.sort((a, b) => a.name.localeCompare(b.name))

	return {
		countries: countryList,
		cities: allCityOptions,
		zips: allZipOptions,
	}
}
