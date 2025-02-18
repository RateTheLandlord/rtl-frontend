import { Options, Review } from '@/util/interfaces/interfaces'

export interface OtherLandlord {
	name: string
	avgrating: number
	topcity: string
	reviewcount: number
}

export interface FilterOptions {
	countries: Options[]
	cities: Options[]
	zips: Options[]
}

export interface ICityReviews {
	reviews: Review[]
	average: number
	total: number
	catAverages: {
		avg_repair: number
		avg_health: number
		avg_stability: number
		avg_privacy: number
		avg_respect: number
	}
	zips: string[]
}

export interface IZipReviews {
	reviews: Review[]
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
export interface IZipStats {
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
