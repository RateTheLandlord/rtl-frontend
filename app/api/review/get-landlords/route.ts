import { getLandlords } from '@/lib/review/landlords'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export async function OPTIONS(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited
	return handleCorsPreflight(request)!
}

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const landlords = await getLandlords()
	return withCors(request, Response.json(landlords))
}
