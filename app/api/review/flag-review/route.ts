import { verifyToken } from '@/lib/captcha/verifyToken'
import { reportReview } from '@/lib/review/mutations/reportReview'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'
import { parseJsonObject } from '@/util/parseJsonObject'

export function OPTIONS(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited
	return handleCorsPreflight(request)!
}

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const body = await parseJsonObject(request)
	if (
		!body ||
		typeof body.id !== 'number' ||
		!Number.isSafeInteger(body.id) ||
		body.id <= 0 ||
		typeof body.flagged_reason !== 'string' ||
		!body.flagged_reason.trim() ||
		typeof body.captchaToken !== 'string' ||
		!body.captchaToken.trim()
	) {
		return withCors(
			request,
			Response.json({ error: 'INVALID_REQUEST_BODY' }, { status: 400 }),
		)
	}

	const captcha = await verifyToken(body.captchaToken)

	if (!captcha) {
		return withCors(
			request,
			Response.json({ error: 'UNAUTHORIZED' }, { status: 401 }),
		)
	}

	const reviews = await reportReview(body.id, body.flagged_reason)
	return withCors(request, Response.json(reviews))
}
