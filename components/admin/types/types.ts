export interface ITabs {
	name: string
	component: JSX.Element
}

export interface ICountryStats {
	total_reviews: number
	countryStats: {
		CA?: {
			total: string
			states: Array<{
				key: string
				total: string
			}>
		}
		US?: {
			total: string
			states: Array<{
				key: string
				total: string
			}>
		}
		AU?: {
			total: string
			states: Array<{
				key: string
				total: string
			}>
		}
		GB?: {
			total: string
			states: Array<{
				key: string
				total: string
			}>
		}
		NZ?: {
			total: string
			states: Array<{
				key: string
				total: string
			}>
		}
		DE?: {
			total: string
			states: Array<{
				key: string
				total: string
			}>
		}
		IE?: {
			total: string
			states: Array<{
				key: string
				total: string
			}>
		}
		NO?: {
			total: string
			states: Array<{
				key: string
				total: string
			}>
		}
	}
}

export interface IDetailedStats {
	date: string
	country_codes: { [key: string]: number }
	cities: { [key: string]: number }
	state: { [key: string]: number }
	zip: { [key: string]: number }
	total: string
}

export interface IStats {
	detailed_stats: Array<IDetailedStats>
	total_stats: ICountryStats
}
