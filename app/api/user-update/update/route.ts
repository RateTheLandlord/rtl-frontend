import { userUpdateReview } from '@/lib/review/models/userUpdateReviewLayer'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { checkRouteRateLimit } from '@/util/routeHandlerRateLimit'
import type { UserUpdatedReview } from '@/util/interfaces/Interfaces'

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const isValidReview = (value: unknown): value is UserUpdatedReview => {
	if (!isRecord(value)) return false

	if (
		typeof value.landlord !== 'string' ||
		value.landlord.trim().length === 0 ||
		value.landlord.length > 150 ||
		typeof value.review !== 'string' ||
		value.review.trim().length === 0 ||
		value.review.length > 1000
	) {
		return false
	}

	const ratings = [
		Number(value.repair),
		Number(value.health),
		Number(value.stability),
		Number(value.privacy),
		Number(value.respect),
	]

	if (
		!ratings.every(
			(rating) =>
				typeof rating === 'number' &&
				Number.isFinite(rating) &&
				rating >= 1 &&
				rating <= 5,
		)
	) {
		return false
	}

	return (
		value.rent === null ||
		(typeof value.rent === 'number' &&
			Number.isFinite(value.rent) &&
			value.rent >= 0)
	)
}

export function OPTIONS(request: Request) {
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

		const { id, review, user_code } = body
		if (
			typeof id !== 'number' ||
			!Number.isSafeInteger(id) ||
			id <= 0 ||
			typeof user_code !== 'string' ||
			user_code.trim().length === 0 ||
			user_code.length > 256 ||
			!isValidReview(review)
		) {
			return withCors(
				request,
				Response.json({ error: 'INVALID_REQUEST_BODY' }, { status: 400 }),
			)
		}

		const result = await userUpdateReview(id, review, user_code)
		return withCors(request, Response.json(result))
	} catch (error) {
		console.error('Failed to update user review:', error)
		return withCors(
			request,
			Response.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 }),
		)
	}
}
