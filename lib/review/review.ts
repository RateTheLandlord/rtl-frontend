import {
	Review,
	ReviewsResponse,
	OtherLandlord,
	FilterOptions,
	ReviewResponseStatus
} from '@/lib/review/models/review'
import { filterReviewWithAI, IResult } from './helpers'
import {
	checkForLandlordSpam,
	checkReviewsForSimilarity,
	updateRecentReviews,
} from './review-text-match'
import sql from '../db'
import { getExistingReviewsForLandlord } from '@/lib/review/models/review-data-layer'
import { createReview } from '@/lib/review/models/review-data-layer'
import { updateReview } from '@/lib/review/models/review-data-layer'
import { Row, RowList } from 'postgres'
import { capitalize } from '@/util/helpers/helper-functions'
import { Options } from '@/util/interfaces/interfaces'

export type ReviewQuery = {
	page?: number
	limit?: number
	search?: string
	sort?: 'az' | 'za' | 'new' | 'old' | 'high' | 'low'
	state?: string
	country?: string
	city?: string
	zip?: string
}

export async function filterOptions(
	country?: string,
	state?: string,
	city?: string,
): Promise<FilterOptions> {
	const stateClause = state
		? sql`AND state =
    ${state.toUpperCase()}`
		: sql``
	const countryClause = country
		? sql`AND country_code =
            ${country.toUpperCase()}`
		: sql``
	const cityClause = city
		? sql`AND city =
    ${city.toUpperCase()}`
		: sql``

	// Fetch countries
	const countries = await sql`
        SELECT DISTINCT country_code
        FROM review;
    `
	const countryList = countries.map(({ country_code }) => country_code)

	// Fetch states
	const states = await sql`
        SELECT DISTINCT state
        FROM review
        WHERE 1 = 1 ${countryClause};
    `
	const stateList = states.map(({ state }) => state)

	// Fetch cities
	const cities = await sql`
        SELECT DISTINCT city
        FROM review
        WHERE 1 = 1 ${countryClause} ${stateClause};
    `
	const cityList = cities.map(({ city }) => city)

	// Fetch zips
	const zips = await sql`
        SELECT DISTINCT zip
        FROM review
        WHERE 1 = 1 ${countryClause} ${stateClause} ${cityClause};
    `
	const zipsExtracted = zips.map(({ zip }) => zip)

	const zipList = zipsExtracted.filter((zip) => zip.length > 0)

	const filteredCity = cityList.filter((n) => n)
	const allCityOptions = filteredCity.map((c, id) => {
		const city = c.toLowerCase().trim()
		return {
			id: id + 1,
			name: city.split(' ').map(capitalize).join(' '),
			value: c.toLowerCase().trim(),
		}
	})

	allCityOptions.sort((a: Options, b: Options): number =>
		a.name.localeCompare(b.name),
	)

	const allStateOptions = stateList.map((s, id) => {
		const state = s.toLowerCase()
		return {
			id: id + 1,
			name: state.split(' ').map(capitalize).join(' '),
			value: s,
		}
	})

	allStateOptions.sort((a: Options, b: Options): number =>
		a.name.localeCompare(b.name),
	)

	const seenZips = new Set<string>()
	const allZipOptions = zipList.reduce((acc, z, id) => {
		const zip = z.toUpperCase().replace(/\s+/g, '')
		if (!seenZips.has(zip)) {
			seenZips.add(zip)
			acc.push({
				id: id + 1,
				name: zip,
				value: zip,
			})
		}
		return acc
	}, [] as { id: number; name: string; value: string }[])

	allZipOptions.sort((a: Options, b: Options): number =>
		a.name.localeCompare(b.name),
	)

	return {
		countries: countryList,
		states: allStateOptions,
		cities: allCityOptions,
		zips: allZipOptions,
	}
}

export async function getReviews(
	params: ReviewQuery,
): Promise<ReviewsResponse> {
	const {
		page: pageNumber = 1,
		limit: limitParam = 25,
		search,
		sort,
		state,
		country,
		city,
		zip,
	} = params

	const offset = (pageNumber - 1) * limitParam

	let orderBy = sql`id`
	if (sort === 'az' || sort === 'za') {
		orderBy = sql`landlord`
	} else if (sort === 'new' || sort === 'old') {
		orderBy = sql`date_added`
	} else if (sort === 'high' || sort === 'low') {
		orderBy = sql`(repair + health + stability + privacy + respect) / 5`
	}

	const sortOrder =
		sort === 'az' || sort === 'old' || sort === 'low' ? sql`ASC` : sql`DESC`

	const searchClause =
		search && search.length > 0
			? sql`AND (landlord ILIKE
              ${'%' + search + '%'}
              )`
			: sql``

	const stateClause = state
		? sql`AND state =
    ${state.toUpperCase()}`
		: sql``
	const countryClause = country
		? sql`AND country_code =
            ${country.toUpperCase()}`
		: sql``
	const cityClause = city
		? sql`AND city =
    ${city.toUpperCase()}`
		: sql``
	const zipClause = zip
		? sql`AND zip =
    ${zip.toUpperCase()}`
		: sql``

	// Fetch reviews
	const reviews = (await sql`
        SELECT *
        FROM review
        WHERE 1 = 1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
		AND (flagged = false OR (flagged = true AND admin_approved = true))
        ORDER BY ${orderBy} ${sortOrder} LIMIT ${limitParam}
        OFFSET ${offset}
    `) as Array<Review>

	// Fetch total number of reviews
	const totalResult = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause} ${zipClause}
    `
	const total = totalResult[0].count

	// Fetch countries
	const countries = await sql`
        SELECT DISTINCT country_code
        FROM review;
    `
	const countryList = countries.map(({ country_code }) => country_code)

	// Fetch states
	const states = await sql`
        SELECT DISTINCT state
        FROM review
        WHERE 1 = 1 ${countryClause};
    `
	const stateList = states.map(({ state }) => state)

	// Fetch cities
	const cities = await sql`
        SELECT DISTINCT city
        FROM review
        WHERE 1 = 1 ${countryClause} ${stateClause};
    `
	const cityList = cities.map(({ city }) => city)

	// Fetch zips
	const zips = await sql`
        SELECT DISTINCT zip
        FROM review
        WHERE 1 = 1 ${countryClause} ${stateClause} ${cityClause};
    `
	const zipsExtracted = zips.map(({ zip }) => zip)

	const zipList = zipsExtracted.filter((zip) => zip.length > 0)

	// Return ReviewsResponse object
	return {
		reviews,
		total,
		countries: countryList,
		states: stateList,
		cities: cityList,
		zips: zipList,
		limit: limitParam,
	}
}

export async function findOne(id: number): Promise<Review[]> {
	return sql<Review[]>`Select *
      FROM review
      WHERE id IN (${id});`
}

export async function create(inputReview: Review): Promise<ReviewResponseStatus> {
	try {
		const existingReviewsForLandlord: Review[] =
			await getExistingReviewsForLandlord(inputReview)
		const reviewSpamDetected: boolean = await checkReviewsForSimilarity(
			existingReviewsForLandlord,
			inputReview.review,
		)

		const landlordSpamDetected: boolean = await checkForLandlordSpam(
			inputReview.landlord,
		)

		// Don't post the review to the DB if we detect spam
		if (reviewSpamDetected || landlordSpamDetected) return {message:"This landlord is currently under spam protection please try again later", success:false} 

		updateRecentReviews(inputReview.landlord)
		if (process.env.NEXT_PUBLIC_ENVIRONMENT == 'development')
			return createReview(inputReview, {
				flagged: false,
				flagged_reason: 'DEV REVIEW',
			}) // Hit data layer to create review

		const filterResult: IResult = await filterReviewWithAI(inputReview)
		return createReview(inputReview, filterResult) // Hit data layer to create review
	} catch (e) {
		throw e
	}
}

export async function update(id: number, review: Review): Promise<Review> {
	return updateReview(id, review)
}

export async function report(id: number, reason: string): Promise<number> {
	reason.length > 250 ? (reason = `${reason.substring(0, 250)}...`) : reason
	await sql`UPDATE review SET flagged = true, flagged_reason = ${reason}
      WHERE id = ${id} RETURNING id;`

	return id
}

export async function deleteReview(id: number): Promise<boolean> {
	await sql`DELETE
                                   FROM review
                                   WHERE ID = ${id};`

	return true
}

export async function getFlagged(): Promise<Review[]> {
	const reviews = await sql<
		Review[]
	>`SELECT * FROM review WHERE flagged = true;`
	return reviews
}

export async function getLandlords(): Promise<string[]> {
	const landlords = await sql`SELECT DISTINCT landlord FROM review;`
	return landlords.map(({ landlord }) => landlord)
}

export interface ILandlordReviews {
	reviews: Review[]
	average: number
	total: number
	catAverages: {
		avg_repair: number
		avg_health: number
		avg_stability: number
		avg_privacy: number
		avg_respect: number
	}
}

export async function getLandlordReviews(
	landlord: string,
): Promise<ILandlordReviews> {
	landlord = decodeURIComponent(landlord)

	const reviews = await sql<Review[]>`Select *
      FROM review
      WHERE landlord IN (${landlord}) ORDER BY date_added DESC`

	const averageByCat = await sql`
	  SELECT 
		  AVG(repair) AS avg_repair,
		  AVG(health) AS avg_health,
		  AVG(stability) AS avg_stability,
		  AVG(privacy) AS avg_privacy,
		  AVG(respect) AS avg_respect
	  FROM review
	  WHERE landlord = ${landlord.toLocaleUpperCase()};
  `

	const combinedAvgResult = await sql`
        SELECT 
            (AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS combined_avg
        FROM review
        WHERE landlord = ${landlord.toLocaleUpperCase()};
    `

	const totalResult = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE landlord = ${landlord.toLocaleUpperCase()};
    `
	const total = totalResult[0].count

	const combinedAvg = Math.round(combinedAvgResult[0].combined_avg)

	const catAverages = {
		avg_repair: Math.round(averageByCat[0].avg_repair),
		avg_health: Math.round(averageByCat[0].avg_health),
		avg_stability: Math.round(averageByCat[0].avg_stability),
		avg_respect: Math.round(averageByCat[0].avg_respect),
		avg_privacy: Math.round(averageByCat[0].avg_privacy),
	}

	return {
		reviews: reviews,
		average: combinedAvg,
		total: total,
		catAverages: catAverages,
	}
}

export async function getOtherLandlords(
	landlord: string,
): Promise<OtherLandlord[]> {
	const topCity = await sql`
		SELECT
		city,
		COUNT(*) as count,
		MAX(date_added)
		FROM review 
		WHERE landlord = ${landlord.toLocaleUpperCase()}
		GROUP BY city
		ORDER BY COUNT(*) DESC, MAX(date_added) DESC
		LIMIT 1;
		`

	const otherLandlords = await sql<OtherLandlord[]>`
		SELECT DISTINCT
		re.landlord AS name,
		(SELECT 
			(AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS combined_avg
			FROM review
			WHERE landlord = re.landlord) AS avgrating,
		re.city AS topcity,
		(SELECT
			COUNT(*)
			FROM review
			WHERE landlord = re.landlord) AS ReviewCount,
		RANDOM()
		FROM review re
		WHERE re.city = ${topCity[0].city}
		AND re.landlord != ${landlord.toLocaleUpperCase()}
		ORDER BY RANDOM()
		LIMIT 10
		`
	return otherLandlords
}

export async function getLandlordSuggestions(
	landlord: string,
): Promise<string[]> {
	if (!landlord) return []
	const suggestions = await sql`
    SELECT DISTINCT landlord FROM review WHERE landlord LIKE ${
			'%' + landlord.toLocaleUpperCase() + '%'
		}
    `
	return suggestions.map(({ landlord }) => landlord)
}

export async function getCities(): Promise<RowList<Row[]>> {
	const cities = await sql`SELECT DISTINCT ON (city)
    city,
    state,
    country_code
FROM
    review
ORDER BY
    city,
    state,
    country_code`

	return cities
}

export interface ICityReviews {
	reviews: Review[]
	average: number
	total: number
	catAverages: {
		avg_repair: number
		avg_health: number
		avg_stability: number
		avg_privacy: number
		avg_respect: number
	}
	zips: string[]
}

export async function getCityReviews(params: {
	city: string
	state: string
	country_code: string
	offset?: string
	sort?: 'az' | 'za' | 'new' | 'old' | 'high' | 'low'
}): Promise<ICityReviews> {
	const city = decodeURIComponent(params.city)
	const state = decodeURIComponent(params.state)
	const country_code = decodeURIComponent(params.country_code)
	const offset = params.offset ? params.offset : 0
	const sort = params.sort ? params.sort : 'new'

	let orderBy = sql`id`
	if (sort === 'az' || sort === 'za') {
		orderBy = sql`landlord`
	} else if (sort === 'new' || sort === 'old') {
		orderBy = sql`date_added`
	} else if (sort === 'high' || sort === 'low') {
		orderBy = sql`(repair + health + stability + privacy + respect) / 5`
	}

	const sortOrder =
		sort === 'az' || sort === 'old' || sort === 'low' ? sql`ASC` : sql`DESC`

	const reviews = await sql<Review[]>`
        SELECT *
        FROM review
        WHERE city = ${city.toLocaleUpperCase()} AND state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()}
        ORDER BY ${orderBy} ${sortOrder}
        LIMIT 25
        OFFSET ${offset}
    `

	const totalResult = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE city = ${city.toLocaleUpperCase()} AND state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()}
    `
	const total = totalResult[0].count

	const averageByCat = await sql`
        SELECT 
            AVG(repair) AS avg_repair,
            AVG(health) AS avg_health,
            AVG(stability) AS avg_stability,
            AVG(privacy) AS avg_privacy,
            AVG(respect) AS avg_respect
        FROM review
        WHERE city = ${city.toLocaleUpperCase()} AND state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()}
    `

	const combinedAvgResult = await sql`
        SELECT 
            (AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS combined_avg
        FROM review
        WHERE city = ${city.toLocaleUpperCase()} AND state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()}
    `

	const zips = await sql`
        SELECT DISTINCT zip
        FROM review
		WHERE city = ${city.toLocaleUpperCase()} AND state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()}
    `
	const zipList = zips.map(({ zip }) => zip)

	const combinedAvg = Math.round(combinedAvgResult[0].combined_avg)

	const catAverages = {
		avg_repair: Math.round(averageByCat[0].avg_repair),
		avg_health: Math.round(averageByCat[0].avg_health),
		avg_stability: Math.round(averageByCat[0].avg_stability),
		avg_respect: Math.round(averageByCat[0].avg_respect),
		avg_privacy: Math.round(averageByCat[0].avg_privacy),
	}

	return {
		reviews: reviews,
		average: combinedAvg,
		total: total,
		catAverages: catAverages,
		zips: zipList,
	}
}

export type ZipQuery = {
	zip: string
	state: string
	country_code: string
}

export interface IZipStats {
	average: number
	total: number
	catAverages: {
		avg_repair: number
		avg_health: number
		avg_stability: number
		avg_privacy: number
		avg_respect: number
	}
}

export async function getZipInfo(params: {
	zip: string
	state: string
	country_code: string
}): Promise<IZipStats> {
	const zip = decodeURIComponent(params.zip)
	const state = decodeURIComponent(params.state)
	const country_code = decodeURIComponent(params.country_code)

	const totalResult = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE zip = ${zip.toLocaleUpperCase()} AND state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()}
    `
	const total = totalResult[0].count

	const averageByCat = await sql`
        SELECT 
            AVG(repair) AS avg_repair,
            AVG(health) AS avg_health,
            AVG(stability) AS avg_stability,
            AVG(privacy) AS avg_privacy,
            AVG(respect) AS avg_respect
        FROM review
        WHERE zip = ${zip.toLocaleUpperCase()} AND state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()}
    `

	const combinedAvgResult = await sql`
        SELECT 
            (AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS combined_avg
        FROM review
        WHERE zip = ${zip.toLocaleUpperCase()} AND state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()}
    `

	const combinedAvg = Math.round(combinedAvgResult[0].combined_avg)

	const catAverages = {
		avg_repair: Math.round(averageByCat[0].avg_repair),
		avg_health: Math.round(averageByCat[0].avg_health),
		avg_stability: Math.round(averageByCat[0].avg_stability),
		avg_respect: Math.round(averageByCat[0].avg_respect),
		avg_privacy: Math.round(averageByCat[0].avg_privacy),
	}

	return {
		average: combinedAvg,
		total: total,
		catAverages: catAverages,
	}
}

export interface IZipReviews {
	reviews: Review[]
	average: number
	total: number
	catAverages: {
		avg_repair: number
		avg_health: number
		avg_stability: number
		avg_privacy: number
		avg_respect: number
	}
}

export async function getZipReviews(params: {
	state: string
	zip: string
	country_code: string
	offset?: string
	sort?: 'az' | 'za' | 'new' | 'old' | 'high' | 'low'
}): Promise<IZipReviews> {
	const state = decodeURIComponent(params.state)
	const zip = decodeURIComponent(params.zip)
	const country_code = decodeURIComponent(params.country_code)
	const offset = params.offset ? params.offset : 0
	const sort = params.sort ? params.sort : 'new'

	let orderBy = sql`id`
	if (sort === 'az' || sort === 'za') {
		orderBy = sql`landlord`
	} else if (sort === 'new' || sort === 'old') {
		orderBy = sql`date_added`
	} else if (sort === 'high' || sort === 'low') {
		orderBy = sql`(repair + health + stability + privacy + respect) / 5`
	}

	const sortOrder =
		sort === 'az' || sort === 'old' || sort === 'low' ? sql`ASC` : sql`DESC`

	const reviews = await sql<Review[]>`
        SELECT *
        FROM review
        WHERE state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()} AND zip = ${zip.toLocaleUpperCase()}
        ORDER BY ${orderBy} ${sortOrder}
        LIMIT 25
        OFFSET ${offset}
    `

	const totalResult = await sql`
        SELECT COUNT(*) as count
        FROM review
        WHERE state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()} AND zip = ${zip.toLocaleUpperCase()}
    `
	const total = totalResult[0].count

	const averageByCat = await sql`
        SELECT 
            AVG(repair) AS avg_repair,
            AVG(health) AS avg_health,
            AVG(stability) AS avg_stability,
            AVG(privacy) AS avg_privacy,
            AVG(respect) AS avg_respect
        FROM review
        WHERE state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()} AND zip = ${zip.toLocaleUpperCase()}
    `

	const combinedAvgResult = await sql`
        SELECT 
            (AVG(repair) + AVG(health) + AVG(stability) + AVG(privacy) + AVG(respect)) / 5 AS combined_avg
        FROM review
        WHERE state = ${state.toLocaleUpperCase()} AND country_code = ${country_code.toLocaleUpperCase()} AND zip = ${zip.toLocaleUpperCase()}
    `

	const combinedAvg = Math.round(combinedAvgResult[0].combined_avg)

	const catAverages = {
		avg_repair: Math.round(averageByCat[0].avg_repair),
		avg_health: Math.round(averageByCat[0].avg_health),
		avg_stability: Math.round(averageByCat[0].avg_stability),
		avg_respect: Math.round(averageByCat[0].avg_respect),
		avg_privacy: Math.round(averageByCat[0].avg_privacy),
	}

	return {
		reviews: reviews,
		average: combinedAvg,
		total: total,
		catAverages: catAverages,
	}
}
