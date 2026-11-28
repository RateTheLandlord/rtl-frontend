import { verifyToken } from '@/lib/captcha/verifyToken'
import { create } from '@/lib/review/models/reviewDataLayer'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'
import type { Review } from '@/util/interfaces/Interfaces'

const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
const rateLimit = isProduction ? 2 : 1000
const rateLimitWindow = 604800000

function methodNotAllowed() {
	return Response.json(
		{ message: 'Method Not Allowed' },
		{ status: 405, headers: { Allow: 'POST' } },
	)
}

export function GET() {
	return methodNotAllowed()
}

export function PUT() {
	return methodNotAllowed()
}

export function PATCH() {
	return methodNotAllowed()
}

export function DELETE() {
	return methodNotAllowed()
}

export function OPTIONS() {
	return methodNotAllowed()
}

export async function POST(request: Request) {
	const limited = checkRouteRateLimit(
		request,
		rateLimit,
		rateLimitWindow,
		'submit-review',
	)
	if (limited) return limited

	const body: unknown = await request.json()
	if (
		typeof body !== 'object' ||
		body === null ||
		Array.isArray(body) ||
		!('captchaToken' in body) ||
		typeof body.captchaToken !== 'string' ||
		!body.captchaToken.trim() ||
		!('review' in body) ||
		typeof body.review !== 'object' ||
		body.review === null ||
		Array.isArray(body.review)
	) {
		return Response.json({ message: 'Invalid request body' }, { status: 400 })
	}

	try {
		const captchaValid = await verifyToken(body.captchaToken)
		if (!captchaValid) return Response.json('UNAUTHORIZED', { status: 401 })

		const result = await create(body.review as Review)
		return Response.json(result)
	} catch (error) {
		console.error('Error submitting review:', error)
		return Response.json(
			{ message: 'Unable to submit review' },
			{ status: 500 },
		)
	}
}
