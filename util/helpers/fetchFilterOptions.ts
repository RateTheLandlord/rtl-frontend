import { FilterOptions } from '../interfaces/interfaces'

export async function fetchFilterOptions(
	country?: string,
	state?: string,
	city?: string,
	signal?: AbortSignal,
): Promise<FilterOptions> {
	const url = '/api/review/get-filter-options'

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ country, state, city }),
			signal,
		})

		if (!response.ok) {
			throw new Error(`Filter options request failed: ${response.status}`)
		}

		return (await response.json()) as FilterOptions
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			throw error
		}

		console.error('Error fetching filter options:', error)

		return {
			countries: [],
			states: [],
			cities: [],
			zips: [],
		}
	}
}
