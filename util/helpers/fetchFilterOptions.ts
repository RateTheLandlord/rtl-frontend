import { QueryParams } from '@/components/reviews/review'
import { FilterOptions } from '../interfaces/interfaces'

export async function fetchFilterOptions(
	queryParams?: QueryParams,
): Promise<FilterOptions> {
	const url = `/api/review/get-filter-options`

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ queryParams }),
		})

		if (!response.ok) {
			throw new Error('Network response was not ok')
		}

		const data: FilterOptions = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching filter options:', error)
		throw error
	}
}


