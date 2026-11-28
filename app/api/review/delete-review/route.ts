import { auth0 } from '@/lib/auth0'
import { deleteReview } from '@/lib/review/models/adminDeleteReview'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
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
		if (
			!body ||
			typeof body !== 'object' ||
			!('id' in body) ||
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

		const deleted = await deleteReview(body.id)
		if (!deleted) {
			return withCors(
				request,
				NextResponse.json(
					{ error: 'REVIEW_NOT_FOUND' },
					{ status: 404, headers: authResponse.headers },
				),
			)
		}

		return withCors(
			request,
			NextResponse.json(
				{ message: 'Review deleted' },
				{ headers: authResponse.headers },
			),
		)
	} catch (error) {
		console.error('Failed to delete review:', error)
		return withCors(
			request,
			NextResponse.json(
				{ error: 'INTERNAL_SERVER_ERROR' },
				{ status: 500, headers: authResponse.headers },
			),
		)
	}
})
