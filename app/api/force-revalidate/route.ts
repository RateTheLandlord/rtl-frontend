import { revalidatePath } from 'next/cache'
import { routing } from '@/i18n/routing'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export function OPTIONS(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited
	return handleCorsPreflight(request)!
}

export function GET(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const url = new URL(request.url)
	const landlord = url.searchParams.get('path')
	if (!landlord) {
		return withCors(
			request,
			Response.json({ message: 'Invalid path' }, { status: 401 }),
		)
	}

	try {
		const landlordPath = encodeURIComponent(landlord)
		for (const locale of routing.locales) {
			revalidatePath(`/${locale}/landlord/${landlordPath}`)
		}
		return withCors(request, Response.json({ revalidated: true }))
	} catch {
		return withCors(
			request,
			new Response('Error revalidating', { status: 500 }),
		)
	}
}
