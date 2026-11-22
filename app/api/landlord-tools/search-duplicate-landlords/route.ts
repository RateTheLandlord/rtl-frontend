import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { findDuplicateCandidates } from '@/lib/landlordTools/searchDuplicateLandlords'
import { getAdminRouteAuth } from '@/util/routeHandlerAdmin'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse, type NextRequest } from 'next/server'

type Body = {
	name: string
	country_code: string
}

export const OPTIONS = withApiAuthRequired(async (request: NextRequest) =>
	handleCorsPreflight(request)!,
)

export const POST = withApiAuthRequired(async (request: NextRequest) => {
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

	const { name, country_code } = (await request.json()) as Body
	const result = await findDuplicateCandidates(name, country_code)
	return withCors(request, NextResponse.json(result, { headers: response.headers }))
})
