import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { deleteLandlord } from '@/lib/suspiciousLandlords/suspiciousLandlords'
import { getAdminRouteAuth } from '@/util/routeHandlerAdmin'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse, type NextRequest } from 'next/server'

export const OPTIONS = withApiAuthRequired(async (request: NextRequest) =>
	handleCorsPreflight(request)!,
)

export const POST = withApiAuthRequired(async (request: NextRequest) => {
	const { response, authorized } = await getAdminRouteAuth(request, 'rtl-001')
	if (!authorized) {
		return withCors(
			request,
			NextResponse.json(
				{ error: 'UNAUTHORIZED' },
				{ status: 401, headers: response.headers },
			),
		)
	}

	const { id } = (await request.json()) as { id: number }
	const result = await deleteLandlord(id)
	return withCors(
		request,
		NextResponse.json(result.message, {
			status: result.status,
			headers: response.headers,
		}),
	)
})
