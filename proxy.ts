import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './src/i18n/routing'

export function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	const locale =
		request.nextUrl.locale === 'fr-CA' || pathname.startsWith('/fr-CA/')
			? 'fr-CA'
			: routing.defaultLocale
	const normalizedPath = pathname.replace(/^\/fr-CA(?=\/|$)/, '')
	const isFrenchResourcesPath =
		locale === 'fr-CA' && normalizedPath === '/resources'
	const requestHeaders = new Headers(request.headers)
	requestHeaders.set('x-next-intl-locale', locale)

	if (isFrenchResourcesPath) {
		// The Pages Router i18n config strips `/fr-CA` before App Router matching.
		// Rewrite to a stable internal path so the French App route remains distinct.
		const destination = new URL('/localized/fr-CA/resources', request.url)
		destination.search = request.nextUrl.search
		const response = NextResponse.rewrite(destination, {
			request: { headers: requestHeaders },
		})
		return response
	}

	return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
	matcher: ['/resources', '/fr-CA/resources'],
}
