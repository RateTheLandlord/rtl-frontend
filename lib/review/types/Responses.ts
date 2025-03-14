import { Review } from '@/util/interfaces/interfaces'

export interface ReviewsResponse {
	reviews: Review[]
	total: number
}

export interface ReviewResponseStatus {
	success: boolean
	message: string
}
