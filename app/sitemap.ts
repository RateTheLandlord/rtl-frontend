import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/metadata'
import {
	getCitySitemapRows,
	getLandlordSitemapRows,
	getZipSitemapRows,
} from '@/lib/seo/sitemapData'

export const dynamic = 'force-dynamic'

const languagesFor = (path: string) => ({
	'en-CA': `${SITE_URL}${path}`,
	'fr-CA': `${SITE_URL}/fr-CA${path === '/' ? '' : path}`,
	'x-default': `${SITE_URL}${path}`,
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [landlords, cities, zips] = await Promise.all([
		getLandlordSitemapRows(),
		getCitySitemapRows(),
		getZipSitemapRows(),
	])

	const staticPaths = [
		'/',
		'/about',
		'/faq',
		'/privacy-policy',
		'/terms-and-conditions',
		'/reviews',
		'/resources',
	]
	const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
		url: `${SITE_URL}${path === '/' ? '' : path}`,
		alternates: { languages: languagesFor(path) },
	}))
	const addEntry = (path: string, lastModified: Date | string) => {
		const normalizedPath = `/${path.replace(/^\/+/, '')}`
		entries.push({
			url: `${SITE_URL}${normalizedPath}`,
			lastModified: new Date(lastModified),
			alternates: { languages: languagesFor(normalizedPath) },
		})
	}

	for (const { landlord, last_modified } of landlords) {
		addEntry(`landlord/${encodeURIComponent(landlord)}`, last_modified)
	}
	for (const { country_code, state, city, last_modified } of cities) {
		addEntry(
			`cities/${encodeURIComponent(country_code)}/${encodeURIComponent(state)}/${encodeURIComponent(city)}`,
			last_modified,
		)
	}
	for (const { country_code, state, zip, last_modified } of zips) {
		addEntry(
			`zips/${encodeURIComponent(country_code)}/${encodeURIComponent(state)}/${encodeURIComponent(zip)}`,
			last_modified,
		)
	}

	return entries
}
