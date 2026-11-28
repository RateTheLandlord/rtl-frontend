import { getStateStats } from '@/lib/review/stateStats'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'

export function OPTIONS(request: Request) {
	return handleCorsPreflight(request)!
}

export async function POST(request: Request) {
	const params = (await request.json()) as { state: string; country: string }
	const stats = await getStateStats(params)
	return withCors(request, Response.json(stats))
}
