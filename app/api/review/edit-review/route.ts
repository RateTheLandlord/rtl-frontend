import { auth0 } from '@/lib/auth0'
import { updateReview } from '@/lib/review/models/adminUpdateReview'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import type { Review } from '@/util/interfaces/Interfaces'
import { NextResponse, type NextRequest } from 'next/server'

const methodNotAllowed = auth0.withApiAuthRequired(async (request: NextRequest) =>
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

export const OPTIONS = auth0.withApiAuthRequired(async (request: NextRequest) =>
	handleCorsPreflight(request)!,
)

export const POST = auth0.withApiAuthRequired(async (request: NextRequest) => {
	const authResponse = new NextResponse()
	try {
		const session = await auth0.getSession(request)
		if (session?.user?.role !== 'ADMIN') {
			return withCors(
				request,
				NextResponse.json(
					{ error: 'FORBIDDEN' },
					{ status: 403, headers: authResponse.headers },
				),
			)
		}

		const body: Partial<Review> | null = await request.json()
		if (
			!body ||
			typeof body !== 'object' ||
			typeof body.id !== 'number' ||
			!Number.isSafeInteger(body.id) ||
			body.id <= 0
		) {
			return withCors(
				request,
				NextResponse.json(
					{ error: 'INVALID_REQUEST_BODY' },
					{ status: 400, headers: authResponse.headers },
				),
			)
		}

		const updatedReview = await updateReview(body.id, body as Review)
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
