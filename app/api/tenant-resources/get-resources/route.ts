import { getResources } from '@/lib/tenantResource/resource'
import type { ResourceQuery } from '@/lib/tenantResource/Types'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const { queryParams = {} } = (await request.json()) as {
		queryParams?: ResourceQuery
	}
	return Response.json(await getResources(queryParams))
}
