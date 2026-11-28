import { auth0 } from '@/lib/auth0'
import { deleteLandlord } from '@/lib/suspiciousLandlords/suspiciousLandlords'
import { getAdminRouteAuth } from '@/util/routeHandlerAdmin'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse } from 'next/server'

export const OPTIONS = auth0.withApiAuthRequired((request: Request) =>
	handleCorsPreflight(request)!,
)

export const POST = auth0.withApiAuthRequired(async (request: Request) => {
	const { response, authorized } = await getAdminRouteAuth('rtl-001')
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
