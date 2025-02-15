import { Options, Review } from '@/util/interfaces/interfaces'

export interface OtherLandlord {
	name: string
	avgrating: number
	topcity: string
	reviewcount: number
}

export interface ReviewsResponse {
	reviews: Review[]
	total: number
	countries: string[]
	cities: string[]
	zips: string[]
	limit: number
}

export interface FilterOptions {
	countries: Options[]
	cities: Options[]
	zips: Options[]
}

export interface ReviewResponseStatus {
	success: boolean
	message: string
}
