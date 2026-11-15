import type { Metadata } from 'next'
import type { AbstractIntlMessages } from 'next-intl'
import { headers } from 'next/headers'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@/styles/global.css'
import AppRouterResourcesProviders from '@/components/resources/AppRouterResourcesProviders'
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

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const requestHeaders = await headers()
	const requestLocale = requestHeaders.get('x-next-intl-locale')
	const locale =
		routing.locales.find((supported) => supported === requestLocale) ??
		routing.defaultLocale
	const messages = {
		...readLocaleFile('resources', locale),
		...readLocaleFile('alerts', locale),
		...readLocaleFile('layout', locale),
		...readLocaleFile('filters', locale),
		...readLocaleFile('createreview', locale),
	} as AbstractIntlMessages

	return (
		<html lang={locale}>
			<body>
				<AppRouterResourcesProviders locale={locale} messages={messages}>
					{children}
				</AppRouterResourcesProviders>
			</body>
		</html>
	)
}
