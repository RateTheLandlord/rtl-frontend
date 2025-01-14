import { AnalyticsResponseInterface } from '@/util/interfaces/interfaces'

export type AnalyticsResponse = {
	totalReviewsT90: number,
	totalReviewsT180: number,
	totalReviewsT360: number,
	avgRatingT90: number,
	avgRatingT180: number,
	avgRatingT360: number,
	medianRentT90: number,
	medianRentT180: number,
	medianRentT360: number
}

export type AnalyticsChartResponse = {
	reviewsChartData: AnalyticsResponseInterface[],
	avgRatingChartData: AnalyticsResponseInterface[],
	medianChartData: AnalyticsResponseInterface[]
}

