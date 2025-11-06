import { UserReview } from '@/util/interfaces/interfaces'

export enum Message {
	RATE_LIMIT = 'rate_limit',
	SUCCESS = 'success',
	INCORRECT = 'incorrect',
	NO_CODE = 'no_code',
	NOT_FOUND = 'not_found',
}

export interface UserReviewsResponse {
	reviews: UserReview[]
	total: number
}

export interface ReviewResponseStatus {
	success: boolean
	message: string
	user_code?: string
}

export interface UserUpdateReviewResponse {
	success: boolean
	message: Message
}
