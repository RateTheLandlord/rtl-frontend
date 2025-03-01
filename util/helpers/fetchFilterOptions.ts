import { FilterOptions } from '../interfaces/interfaces'

export async function fetchFilterOptions(
	country?: string,
	state?: string,
	city?: string,
	zip?: string,
): Promise<FilterOptions> {
	const url = `/api/review/get-filter-options`

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ country, state, city, zip }),
		})

		if (!response.ok) {
			throw new Error('Network response was not ok')
		}

		const data = (await response.json()) as FilterOptions
		return data
	} catch {
		console.error('Error fetching filter options')
		return { countries: [], states: [], cities: [], zips: [] }
	}
}
