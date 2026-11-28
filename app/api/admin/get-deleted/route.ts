import { auth0 } from '@/lib/auth0'
import { getDeleted } from '@/lib/review/models/adminDeleteReview'
import { getAdminRouteAuth } from '@/util/routeHandlerAdmin'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse } from 'next/server'

export const OPTIONS = auth0.withApiAuthRequired((request: Request) =>
	handleCorsPreflight(request)!,
)

export const GET = auth0.withApiAuthRequired(async (request: Request) => {
	const { response, authorized } = await getAdminRouteAuth()
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
		NextResponse.json(await getDeleted(), { headers: response.headers }),
	)
})
