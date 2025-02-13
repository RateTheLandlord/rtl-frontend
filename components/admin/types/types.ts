export interface ITabs {
	name: string
	component: JSX.Element
}

export interface ICountryStats {
	total_reviews: number
	countryStats: {
		CA?: {
			total: string
			states: {
				key: string
				total: string
			}[]
		}
		US?: {
			total: string
			states: {
				key: string
				total: string
			}[]
		}
		AU?: {
			total: string
			states: {
				key: string
				total: string
			}[]
		}
		GB?: {
			total: string
			states: {
				key: string
				total: string
			}[]
		}
		NZ?: {
			total: string
			states: {
				key: string
				total: string
			}[]
		}
		DE?: {
			total: string
			states: {
				key: string
				total: string
			}[]
		}
		IE?: {
			total: string
			states: {
				key: string
				total: string
			}[]
		}
		NO?: {
			total: string
			states: {
				key: string
				total: string
			}[]
		}
	}
}

interface IDetailedStats {
	date: string
	country_codes: Record<string, number>
	cities: Record<string, number>
	state: Record<string, number>
	zip: Record<string, number>
	total: string
}

export interface IStats {
	detailed_stats: IDetailedStats[]
	total_stats: ICountryStats
}
