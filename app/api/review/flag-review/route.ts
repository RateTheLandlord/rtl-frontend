import { verifyToken } from '@/lib/captcha/verifyToken'
import { report } from '@/lib/review/models/userReportReview'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'

interface FlagReviewBody {
	id: number
	flagged_reason: string
	captchaToken: string
}

export function OPTIONS(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited
	return handleCorsPreflight(request)!
}

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(request)
	if (limited) return limited

	const body = (await request.json()) as FlagReviewBody
	const captcha = await verifyToken(body.captchaToken)

	if (!captcha) {
		return withCors(
			request,
			Response.json({ error: 'UNAUTHORIZED' }, { status: 401 }),
		)
	}

	const reviews = await report(body.id, body.flagged_reason)
	return withCors(request, Response.json(reviews))
}
