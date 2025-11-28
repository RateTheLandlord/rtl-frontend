import { UserReview } from '@/util/interfaces/interfaces'

export interface ReviewQuery {
	page?: number
	limit?: number
	search?: string
	sort?: 'az' | 'za' | 'new' | 'old' | 'high' | 'low'
	state?: string
	country?: string
	city?: string
	zip?: string
}

export interface ILandlordReviews {
	reviews: UserReview[]
	average: number
	total: number
	catAverages: {
		avg_repair: number
		avg_health: number
		avg_stability: number
		avg_privacy: number
		avg_respect: number
	}
}

export interface ICityQuery {
	city: string
	state: string
	country_code: string
	offset?: string
	sort?: 'az' | 'za' | 'new' | 'old' | 'high' | 'low'
}

export interface ZipQuery {
	zip: string
	state: string
	country_code: string
}
