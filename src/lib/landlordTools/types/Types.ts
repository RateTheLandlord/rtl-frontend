export type DatabaseRow = {
	id: string | number
	landlord: string | null
	city: string | null
	country_code: string | null
}

export type NameCountMap = Map<string, number>

export type NameRecord = {
	country: string
	name: string
}
export type Candidate = {
	country: string
	name: string
	count: number
	score: number
	cities: string[]
}

export type MatchBlock = {
	aStart: number
	bStart: number
	size: number
}
