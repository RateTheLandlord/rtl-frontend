import { getLandlordReviews } from '@/lib/review/landlords'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export async function OPTIONS(request: Request) {
	return handleCorsPreflight(request)!
}

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const { input } = (await request.json()) as { input: string }
	const reviews = await getLandlordReviews(input)
	return withCors(request, Response.json(reviews))
}
