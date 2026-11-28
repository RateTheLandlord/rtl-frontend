import type { Metadata } from 'next'

export const SITE_URL = 'https://ratethelandlord.org'
export const SITE_NAME = 'Rate The Landlord'

export type SiteLocale = 'en-CA' | 'fr-CA'

const localizedPath = (path: string, locale: SiteLocale) => {
	const normalizedPath = path.startsWith('/') ? path : `/${path}`
	if (locale === 'en-CA') return normalizedPath === '/' ? '' : normalizedPath
	return `/fr-CA${normalizedPath === '/' ? '' : normalizedPath}`
}

export function createPageMetadata(options: {
	locale: SiteLocale
	path: string
	title: string
	description: string
	noindex?: boolean
}): Metadata {
	const canonical = `${SITE_URL}${localizedPath(options.path, options.locale)}`
	const englishUrl = `${SITE_URL}${localizedPath(options.path, 'en-CA')}`
	const frenchUrl = `${SITE_URL}${localizedPath(options.path, 'fr-CA')}`

	return {
		title: { absolute: options.title },
		description: options.description,
		alternates: {
			canonical,
			languages: {
				'en-CA': englishUrl,
				'fr-CA': frenchUrl,
				'x-default': englishUrl,
			},
		},
		openGraph: {
			type: 'website',
			url: canonical,
			title: options.title,
			description: options.description,
			locale: options.locale === 'fr-CA' ? 'fr_CA' : 'en_CA',
			siteName: SITE_NAME,
		},
		...(options.noindex && { robots: { index: false, follow: true } }),
	}
}
