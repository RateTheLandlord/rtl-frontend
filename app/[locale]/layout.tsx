import type { Metadata } from 'next'
import type { AbstractIntlMessages } from 'next-intl'
import { notFound } from 'next/navigation'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@/styles/global.css'
import AppRouterProviders from '@/components/layout/AppRouterProviders'
import { routing } from '@/i18n/routing'
import { readLocaleFile } from '@/util/readLocalFile'

export const metadata: Metadata = {
	title: {
		default: 'Rate The Landlord',
		template: '%s | Rate The Landlord',
	},
	description:
		'Read and share landlord reviews. Help renters make informed decisions about where they live.',
	robots:
		process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
			? undefined
			: { index: false, follow: false },
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>) {
	const { locale } = await params
	if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
		notFound()
	}

	const messages = {
		...readLocaleFile('about', locale),
		...readLocaleFile('alerts', locale),
		...readLocaleFile('createreview', locale),
		...readLocaleFile('filters', locale),
		...readLocaleFile('home', locale),
		...readLocaleFile('layout', locale),
		...readLocaleFile('resources', locale),
		...readLocaleFile('reviews', locale),
	} as AbstractIntlMessages

	return (
		<html lang={locale}>
			<body>
				<AppRouterProviders locale={locale} messages={messages}>
					{children}
				</AppRouterProviders>
			</body>
		</html>
	)
}
