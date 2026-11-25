import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
	const authResponse = await auth0.middleware(request)
	const pathname = request.nextUrl.pathname

	if (
		pathname === '/auth' ||
		pathname.startsWith('/auth/') ||
		pathname === '/api' ||
		pathname.startsWith('/api/') ||
		pathname === '/_vercel' ||
		pathname.startsWith('/_vercel/') ||
		pathname === '/trpc' ||
		pathname.startsWith('/trpc/') ||
		pathname.includes('.')
	) {
		return authResponse
	}

	const intlResponse = intlMiddleware(request)
	const shouldProceed = intlResponse.headers.get('x-middleware-next')

	for (const [key, value] of authResponse.headers) {
		if (key.toLowerCase() === 'set-cookie') continue
		if (key.toLowerCase() === 'x-middleware-next' && !shouldProceed) continue
		intlResponse.headers.set(key, value)
	}

	for (const cookie of authResponse.cookies.getAll()) {
		intlResponse.cookies.set(cookie)
	}

	return intlResponse
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
}
