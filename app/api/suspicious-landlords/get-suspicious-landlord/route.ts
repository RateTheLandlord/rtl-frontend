import { getOneSuspiciousLandlord } from '@/lib/suspiciousLandlords/suspiciousLandlords'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export async function GET(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const url = new URL(request.url)
	const landlord = decodeURIComponent(url.searchParams.get('landlord') || '')
	return Response.json(await getOneSuspiciousLandlord(landlord))
}
