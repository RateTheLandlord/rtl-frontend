import { AnalyticsResponseInterface } from '@/util/interfaces/interfaces'

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
