import type { Metadata } from 'next'
import type { AbstractIntlMessages } from 'next-intl'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@/styles/global.css'
import AppRouterProviders from '@/components/layout/AppRouterProviders'
import { routing } from '@/i18n/routing'
import { readLocaleFile } from '@/util/readLocalFile'
import { auth0 } from '@/lib/auth0'

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
		...readLocaleFile('landlord', locale),
		...readLocaleFile('layout', locale),
		...readLocaleFile('resources', locale),
		...readLocaleFile('reviews', locale),
	} as AbstractIntlMessages
	const session = await auth0.getSession()

	return (
		<html lang={locale}>
			<body>
				<AppRouterProviders
					locale={locale}
					messages={messages}
					initialUser={session?.user}
				>
					{children}
				</AppRouterProviders>
				{process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' && (
					<Script
						src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1233437669445756'
						strategy='afterInteractive'
						crossOrigin='anonymous'
					/>
				)}
			</body>
		</html>
	)
}
