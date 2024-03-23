import { QueryParams, ReviewsResponse } from '@/components/reviews/review'

export async function fetchReviews(
	queryParams?: QueryParams,
): Promise<ReviewsResponse> {
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

		const data: ReviewsResponse = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching reviews:', error)
		throw error
	}
}
