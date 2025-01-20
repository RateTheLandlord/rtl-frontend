import { AnalyticsResponseInterface } from '@/util/interfaces/interfaces'

export type AnalyticsResponse = {
	totalReviewsT90: number,
	totalReviewsT180: number,
	totalReviewsT365: number,
	avgRatingT90: number,
	avgRatingT180: number,
	avgRatingT365: number,
	medianRentT90: number,
	medianRentT180: number,
	medianRentT365: number
}

export type AnalyticsChartResponse = {
	reviewsChartData: AnalyticsResponseInterface[],
	avgRatingChartData: AnalyticsResponseInterface[],
	medianChartData: AnalyticsResponseInterface[]
}

