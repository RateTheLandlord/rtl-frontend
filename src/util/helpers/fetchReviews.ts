import { QueryParams, ReviewsResponse } from '@/components/reviews/review'
import { ResourceResponse } from '../interfaces/interfaces'
import { ResourceQuery } from '@/lib/tenant-resource/types'

export async function fetchReviews(queryParams?: QueryParams) {
	const url = `/api/review/get-reviews`

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

		const data: ReviewsResponse = (await response.json()) as ReviewsResponse
		return data
	} catch {
		console.error('Error fetching reviews')
		return {
			reviews: [],
			total: 0,
		}
	}
}

export async function fetchResources(
	queryParams?: ResourceQuery,
): Promise<ResourceResponse> {
	const url = `/api/tenant-resources/get-resources`

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

		const data: ResourceResponse = (await response.json()) as ResourceResponse
		return data
	} catch {
		console.error('Error fetching Resources')
		return {
			resources: [],
			total: '1',
			countries: [],
			limit: 25,
			states: [],
			cities: [],
		}
	}
}
