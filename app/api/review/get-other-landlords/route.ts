import { getOtherLandlords } from '@/lib/review/landlords'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export function OPTIONS(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited
	return handleCorsPreflight(request)!
}

export async function GET(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const url = new URL(request.url)
	const landlord = decodeURIComponent(url.searchParams.get('landlord') || '')
	const landlords = await getOtherLandlords(landlord)
	return withCors(request, Response.json(landlords))
}
