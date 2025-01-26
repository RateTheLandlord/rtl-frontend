import { AnalyticsResponseInterface } from '@/util/interfaces/interfaces'

export type AnalyticsResponse = {
	avgRatingT90: number
	avgRatingT180: number
	avgRatingT365: number
	medianRentT90: number
	medianRentT180: number
	medianRentT365: number
}

export type AnalyticsChartResponse = {
	avgRatingChartData: AnalyticsResponseInterface[]
	medianChartData: AnalyticsResponseInterface[]
}
