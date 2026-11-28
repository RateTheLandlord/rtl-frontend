import { auth0 } from '@/lib/auth0'
import { updateReview } from '@/lib/review/models/adminUpdateReview'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import type { Review } from '@/util/interfaces/Interfaces'
import { NextResponse } from 'next/server'

const methodNotAllowed = auth0.withApiAuthRequired((request: Request) =>
	withCors(
		request,
		Response.json(
			{ error: 'METHOD_NOT_ALLOWED' },
			{ status: 405, headers: { Allow: 'POST' } },
		),
	),
)

export const GET = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed

export const OPTIONS = auth0.withApiAuthRequired((request: Request) =>
	handleCorsPreflight(request)!,
)

export const POST = auth0.withApiAuthRequired(async (request: Request) => {
	const authResponse = new NextResponse()
	try {
		const session = await auth0.getSession()
		if (session?.user?.role !== 'ADMIN') {
			return withCors(
				request,
				NextResponse.json(
					{ error: 'FORBIDDEN' },
					{ status: 403, headers: authResponse.headers },
				),
			)
		}

		const body: unknown = await request.json()
		if (!body || typeof body !== 'object' || Array.isArray(body)) {
			return withCors(
				request,
				NextResponse.json(
					{ error: 'INVALID_REQUEST_BODY' },
					{ status: 400, headers: authResponse.headers },
				),
			)
		}

		const reviewData = body as Record<string, unknown>
		const reviewId = reviewData.id
		if (
			typeof reviewId !== 'number' ||
			!Number.isSafeInteger(reviewId) ||
			reviewId <= 0
		) {
			return withCors(
				request,
				NextResponse.json(
					{ error: 'INVALID_REQUEST_BODY' },
					{ status: 400, headers: authResponse.headers },
				),
			)
		}

		const updatedReview = await updateReview(reviewId, body as Review)
		return withCors(
			request,
			NextResponse.json(updatedReview, { headers: authResponse.headers }),
		)
	} catch (error) {
		console.error('Failed to edit review:', error)
		return withCors(
			request,
			NextResponse.json(
				{ error: 'INTERNAL_SERVER_ERROR' },
				{ status: 500, headers: authResponse.headers },
			),
		)
	}
})
