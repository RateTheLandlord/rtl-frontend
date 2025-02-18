import { Review } from '@/util/interfaces/interfaces'

export interface ReviewsResponse {
	reviews: Review[]
	total: number
	countries: string[]
	cities: string[]
	zips: string[]
	limit: number
}

export interface ReviewResponseStatus {
	success: boolean
	message: string
}
