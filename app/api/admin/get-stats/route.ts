import { auth0 } from '@/lib/auth0'
import { get } from '@/lib/stats/stats'
import { getAdminRouteAuth } from '@/util/routeHandlerAdmin'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse, type NextRequest } from 'next/server'

export const OPTIONS = auth0.withApiAuthRequired(async (request: NextRequest) =>
	handleCorsPreflight(request)!,
)

export const GET = auth0.withApiAuthRequired(async (request: NextRequest) => {
	const { response, authorized } = await getAdminRouteAuth(request)
	if (!authorized) {
		return withCors(
			request,
			NextResponse.json(
				{ error: 'UNAUTHORIZED' },
				{ status: 401, headers: response.headers },
			),
		)
	}

	return withCors(
		request,
		NextResponse.json(await get(), { headers: response.headers }),
	)
})
