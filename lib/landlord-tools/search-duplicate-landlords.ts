/* eslint-disable */
import {
	IGNORE_WORDS,
	LOCATION_WORDS,
	MIN_FUZZY_WORD_LENGTH,
	WORD_MATCH_THRESHOLD,
	OVERALL_MATCH_THRESHOLD,
	MIN_DISPLAY_SCORE,
	MAX_RESULTS_PER_COUNTRY,
} from './constants/constants'
import { MatchBlock, DatabaseRow, Candidate } from './types/types'
import {
	normalizeCountry,
	loadDatabaseIndexes,
	candidateKey,
} from './utils/utils'
import unidecode from 'unidecode'

function tokenize(name: unknown): string[] {
	if (typeof name !== 'string') {
		return []
	}

	const transliterated = unidecode(name).toLowerCase()
	const cleaned = transliterated.replace(/[^a-z0-9\s]/g, ' ')

	return cleaned.split(/\s+/).filter(Boolean)
}

function normalizeForMatching(name: unknown): string {
	const words = tokenize(name)
	return words
		.filter((word) => !IGNORE_WORDS.has(word))
		.filter((word) => !LOCATION_WORDS.has(word))
		.join(' ')
}

function matchingBlocks(a: string, b: string): MatchBlock[] {
	const result: MatchBlock[] = []

	function findLongestMatch(
		alo: number,
		ahi: number,
		blo: number,
		bhi: number,
	): MatchBlock {
		const bPositions = new Map<string, number[]>()

		for (let j = blo; j < bhi; j++) {
			const char = b[j]
			const positions = bPositions.get(char) ?? []
			positions.push(j)
			bPositions.set(char, positions)
		}

		let bestA = alo
		let bestB = blo
		let bestSize = 0
		let previous = new Map<number, number>()

		for (let i = alo; i < ahi; i++) {
			const next = new Map<number, number>()
			const positions = bPositions.get(a[i]) ?? []

			for (const j of positions) {
				if (j < blo || j >= bhi) continue

				const k = previous.get(j - 1) ?? 0
				const size = k + 1
				next.set(j, size)

				if (size > bestSize) {
					bestA = i - size + 1
					bestB = j - size + 1
					bestSize = size
				}
			}

			previous = next
		}

		return { aStart: bestA, bStart: bestB, size: bestSize }
	}

	function recurse(alo: number, ahi: number, blo: number, bhi: number): void {
		const match = findLongestMatch(alo, ahi, blo, bhi)

		if (match.size === 0) return

		recurse(alo, match.aStart, blo, match.bStart)
		result.push(match)
		recurse(match.aStart + match.size, ahi, match.bStart + match.size, bhi)
	}

	recurse(0, a.length, 0, b.length)

	result.sort((x, y) => x.aStart - y.aStart || x.bStart - y.bStart)
	result.push({ aStart: a.length, bStart: b.length, size: 0 })

	return result
}

function sequenceMatcherRatio(a: string, b: string): number {
	if (a === b) return 1
	if (!a.length || !b.length) return 0

	const blocks = matchingBlocks(a, b)
	const matches = blocks.reduce((total, block) => total + block.size, 0)

	return (2 * matches) / (a.length + b.length)
}

function wordsFuzzyMatch(words1: string[], words2: string[]): boolean {
	if (!words1.length || !words2.length) return false

	let shorter = words1
	let longer = words2

	if (shorter.length > longer.length) {
		;[shorter, longer] = [longer, shorter]
	}

	const available = [...longer]

	for (const word of shorter) {
		const exactIndex = available.findIndex((candidate) => candidate === word)

		if (exactIndex !== -1) {
			available.splice(exactIndex, 1)
			continue
		}

		if (word.length < MIN_FUZZY_WORD_LENGTH) return false

		let bestIndex = -1
		let bestScore = 0

		for (let i = 0; i < available.length; i++) {
			const candidate = available[i]
			if (candidate.length < MIN_FUZZY_WORD_LENGTH) continue

			const score = sequenceMatcherRatio(word, candidate)
			if (score > bestScore) {
				bestScore = score
				bestIndex = i
			}
		}

		if (bestScore < WORD_MATCH_THRESHOLD || bestIndex === -1) return false

		available.splice(bestIndex, 1)
	}

	return true
}

function isPotentialMatch(name1: string, name2: string): boolean {
	const n1 = normalizeForMatching(name1)
	const n2 = normalizeForMatching(name2)

	if (!n1 || !n2) return false
	if (n1 === n2) return true

	const words1 = n1.split(' ')
	const words2 = n2.split(' ')

	if (
		words1.length === words2.length &&
		new Set(words1).size === new Set(words2).size &&
		words1.every((word) => words2.includes(word))
	) {
		return true
	}

	const shorterSet =
		words1.length <= words2.length ? new Set(words1) : new Set(words2)
	const longerSet =
		words1.length <= words2.length ? new Set(words2) : new Set(words1)

	if (
		shorterSet.size > 0 &&
		[...shorterSet].every((word) => longerSet.has(word))
	) {
		return true
	}

	if (wordsFuzzyMatch(words1, words2)) return true

	return sequenceMatcherRatio(n1, n2) >= OVERALL_MATCH_THRESHOLD
}

function matchScore(searchName: string, candidateName: string): number {
	const n1 = normalizeForMatching(searchName)
	const n2 = normalizeForMatching(candidateName)

	if (!n1 || !n2) return 0
	if (n1 === n2) return 1

	const words1 = n1.split(' ')
	const words2 = n2.split(' ')

	const set1 = new Set(words1)
	const set2 = new Set(words2)

	if (set1.size === set2.size && [...set1].every((word) => set2.has(word))) {
		return 0.99
	}

	const intersection = [...set1].filter((word) => set2.has(word)).length
	const union = new Set([...set1, ...set2]).size
	const overlap = intersection / Math.max(union, 1)
	const sequence = sequenceMatcherRatio(n1, n2)

	return Math.max(sequence, sequence * 0.75 + overlap * 0.25)
}

function associatedCitiesList(
	rows: DatabaseRow[],
	country: string,
	name: string,
): string[] {
	const cities = new Set<string>()

	for (const row of rows) {
		if (
			normalizeCountry(row.country_code) === country &&
			(row.landlord ?? '') === name
		) {
			const city = (row.city ?? '').trim()
			if (city) {
				cities.add(city)
			}
		}
	}

	return [...cities]
}

/**
 * Takes a search string and returns candidate matches for frontend output.
 */
export async function findDuplicateCandidates(
	searchName: string,
	country_code: string,
): Promise<Candidate[]> {
	const { rows, nameCounts, uniqueRecords } =
		await loadDatabaseIndexes(country_code)

	const results: Candidate[] = []
	const searchNormalized = normalizeForMatching(searchName)
	const searchTokens = new Set(searchNormalized.split(' ').filter(Boolean))

	for (const { country, name } of uniqueRecords) {
		const score = matchScore(searchName, name)
		const candidateTokens = new Set(
			normalizeForMatching(name).split(' ').filter(Boolean),
		)

		const sharesToken = [...searchTokens].some((token) =>
			candidateTokens.has(token),
		)

		const strongMatch = isPotentialMatch(searchName, name)

		if (strongMatch || (sharesToken && score >= MIN_DISPLAY_SCORE)) {
			results.push({
				country,
				name,
				count: nameCounts.get(candidateKey(country, name)) ?? 0,
				score,
				cities: associatedCitiesList(rows, country, name),
			})
		}
	}

	results.sort(
		(a, b) =>
			b.score - a.score ||
			b.count - a.count ||
			a.country.localeCompare(b.country) ||
			a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
	)

	const perCountry = new Map<string, number>()
	const limited: Candidate[] = []

	for (const item of results) {
		const count = perCountry.get(item.country) ?? 0
		if (count >= MAX_RESULTS_PER_COUNTRY) continue

		limited.push(item)
		perCountry.set(item.country, count + 1)
	}

	return limited
}
