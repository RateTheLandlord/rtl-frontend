import { getSuspiciousLandlords } from '@/lib/suspiciousLandlords/suspiciousLandlords'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	return Response.json(await getSuspiciousLandlords())
}
