export interface StatsQuery {
	startDate?: string
	groupBy?: string
}

export interface DetailedStats {
	date: string
	country_codes: Record<string, number>
	cities: Record<string, number>
	state: Record<string, number>
	zip: Record<string, number>
	total?: number
}

export interface TotalStats {
	total_reviews: number
	countryStats: Record<
		string,
		{ total: number; states: { key: string; total: number }[] }
	>
}
