export type CountryStats = Record<
	string,
	{ total: number; states: { key: string; total: number }[] }
>

export interface TotalStats {
	total_reviews: number
	countryStats: CountryStats
}
