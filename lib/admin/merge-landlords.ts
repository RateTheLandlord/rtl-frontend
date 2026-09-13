import sql from '../db'

type Landlord = {
	id: number
	landlord: string
	city: string
	country_code: string
}

const IGNORE_WORDS = [
	'property',
	'properties',
	'management',
	'managed',
	'group',
	'holdings',
	'company',
	'companies',
	'corp',
	'corporation',
	'inc',
	'incorporated',
	'ltd',
	'limited',
	'llc',
	'of',
	'the',
	'at',
	'and',
	'investments',
	'living',
	'american',
	'communities',
	'capital',
	'park',
	'rental',
	'equity',
	'family',
	'york',
	'first',
	'maple',
	'king',
	'real',
	'estate',
	'village',
	'university',
]

const LOCATION_WORDS = [
	'road',
	'rd',
	'street',
	'st',
	'avenue',
	'ave',
	'drive',
	'dr',
	'boulevard',
	'blvd',
	'lane',
	'ln',
	'court',
	'ct',
	'place',
	'pl',
	'parkway',
	'pkwy',
	'highway',
	'hwy',
]

const tokenize = (name: string) => {
	let result = name.toLocaleLowerCase()
	result = result.replace(/[^a-z0-9\s]/g, ' ')
	return result.split(' ')
}

const normalizeForMatching = (name: string) => {
	let words = tokenize(name)
	words = words.filter((word) => !IGNORE_WORDS.includes(word))
	words = words.filter((word) => !LOCATION_WORDS.includes(word))
	return ' '.join(words)
}
