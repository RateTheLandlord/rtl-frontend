import { publicReviewCondition } from '@/lib/review/publicReviewSql'
import sql from '@/lib/db'

type SitemapRow = {
	last_modified: Date | string
}

export type LandlordSitemapRow = SitemapRow & {
	landlord: string
}

export type CitySitemapRow = SitemapRow & {
	country_code: string
	state: string
	city: string
}

export type ZipSitemapRow = SitemapRow & {
	country_code: string
	state: string
	zip: string
}

export async function getLandlordSitemapRows() {
	return sql<LandlordSitemapRow[]>`
		SELECT landlord, MAX(date_added) AS last_modified
		FROM review
		WHERE ${publicReviewCondition}
		GROUP BY landlord
		ORDER BY landlord
	`
}

export async function getCitySitemapRows() {
	return sql<CitySitemapRow[]>`
		SELECT country_code, state, city, MAX(date_added) AS last_modified
		FROM review
		WHERE ${publicReviewCondition}
		GROUP BY country_code, state, city
		ORDER BY country_code, state, city
	`
}

export async function getZipSitemapRows() {
	return sql<ZipSitemapRow[]>`
		SELECT country_code, state, zip, MAX(date_added) AS last_modified
		FROM review
		WHERE ${publicReviewCondition}
			AND zip IS NOT NULL
			AND BTRIM(zip) <> ''
		GROUP BY country_code, state, zip
		ORDER BY country_code, state, zip
	`
}
