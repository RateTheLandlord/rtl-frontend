import { getLocations } from '@/lib/location/location'
import type { Options } from '@/util/interfaces/Interfaces'
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

	const { zipCodes, country_code } = (await request.json()) as {
		zipCodes: Options[]
		country_code: string
	}
	const locations = await getLocations(zipCodes, country_code)
	return withCors(request, Response.json(locations))
}
