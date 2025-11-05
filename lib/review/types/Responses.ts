import { UserReview } from '@/util/interfaces/interfaces'

export interface UserReviewsResponse {
	reviews: UserReview[]
	total: number
}

export interface ReviewResponseStatus {
	success: boolean
	message: string
	user_code?: string
}
