import type { ZipQuery } from '@/lib/review/types/Queries'
import { getZipInfo } from '@/lib/review/zip'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const queryParams =
		((await request.json()) as ZipQuery | null) || ({} as ZipQuery)
	return Response.json(await getZipInfo(queryParams))
}
