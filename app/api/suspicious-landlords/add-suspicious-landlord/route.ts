import { auth0 } from '@/lib/auth0'
import { create } from '@/lib/suspiciousLandlords/suspiciousLandlords'
import type { SuspiciousLandlord } from '@/util/interfaces/Interfaces'
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

	const body = (await request.json()) as SuspiciousLandlord
	const result = await create(body)
	return withCors(
		request,
		NextResponse.json(result.message, {
			status: result.status,
			headers: response.headers,
		}),
	)
})
