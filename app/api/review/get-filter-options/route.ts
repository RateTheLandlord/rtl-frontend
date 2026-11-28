import { filterOptions } from '@/lib/review/filters'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const {
		country = '',
		state = '',
		city = '',
	} = (await request.json()) as {
		country?: string
		state?: string
		city?: string
	}
	const options = await filterOptions(country, state, city)
	return Response.json(options)
}

export function GET() {
	return Response.json(
		{ message: 'Method not allowed' },
		{ status: 405, headers: { Allow: 'POST' } },
	)
}
