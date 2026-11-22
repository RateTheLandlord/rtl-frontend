import { getTrailingReviews } from '@/lib/analytics/review'
import type { ReviewQuery } from '@/lib/review/types/Queries'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const { queryParams = {} } = (await request.json()) as {
		queryParams?: ReviewQuery
	}
	return Response.json(await getTrailingReviews(queryParams))
}
