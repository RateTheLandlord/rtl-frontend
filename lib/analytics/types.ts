import { AnalyticsResponseInterface } from '@/util/interfaces/interfaces'
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

export interface AnalyticsResponse {
	avgRatingT90: number
	avgRatingT180: number
	avgRatingT365: number
	medianRentT90: number
	medianRentT180: number
	medianRentT365: number
}

export interface AnalyticsChartResponse {
	avgRatingChartData: AnalyticsResponseInterface[]
	medianChartData: AnalyticsResponseInterface[]
}
