import { auth0 } from '@/lib/auth0'
import { update } from '@/lib/suspiciousLandlords/suspiciousLandlords'
import type { SuspiciousLandlord } from '@/util/interfaces/Interfaces'
import { getAdminRouteAuth } from '@/util/routeHandlerAdmin'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse, type NextRequest } from 'next/server'

export const OPTIONS = auth0.withApiAuthRequired(async (request: NextRequest) =>
	handleCorsPreflight(request)!,
)

export const POST = auth0.withApiAuthRequired(async (request: NextRequest) => {
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

	const body = (await request.json()) as SuspiciousLandlord & { id: number }
	const result = await update(body.id, body)
	return withCors(
		request,
		NextResponse.json(result.message, {
			status: result.status,
			headers: response.headers,
		}),
	)
})
