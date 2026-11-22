import { userDeleteReview } from '@/lib/review/models/userDeleteReviewLayer'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

export async function OPTIONS(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited
	return handleCorsPreflight(request)!
}

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	try {
		const body: unknown = await request.json()
		if (!isRecord(body)) {
			return withCors(
				request,
				Response.json({ error: 'INVALID_REQUEST_BODY' }, { status: 400 }),
			)
		}

		const { id, user_code } = body
		if (
			typeof id !== 'number' ||
			!Number.isSafeInteger(id) ||
			id <= 0 ||
			typeof user_code !== 'string' ||
			user_code.trim().length === 0 ||
			user_code.length > 256
		) {
			return withCors(
				request,
				Response.json({ error: 'INVALID_REQUEST_BODY' }, { status: 400 }),
			)
		}

		const result = await userDeleteReview(id, user_code)
		return withCors(request, Response.json(result))
	} catch (error) {
		console.error('Failed to delete user review:', error)
		return withCors(
			request,
			Response.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 }),
		)
	}
}
