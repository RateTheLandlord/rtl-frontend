import { getFlaggedKeywords } from '@/lib/flaggedKeywords/flaggedKeywords'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	return Response.json(await getFlaggedKeywords())
}
