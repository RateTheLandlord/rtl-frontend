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
	reviewsChartData: any[],
	avgRatingChartData: any[],
	medianChartData: any[]
}

