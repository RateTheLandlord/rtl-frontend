import { auth0 } from '@/lib/auth0'
import { findDuplicateCandidates } from '@/lib/landlordTools/searchDuplicateLandlords'
import { getAdminRouteAuth } from '@/util/routeHandlerAdmin'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse } from 'next/server'

type Body = {
	name: string
	country_code: string
}

export const OPTIONS = auth0.withApiAuthRequired((request: Request) =>
	handleCorsPreflight(request)!,
)

export const POST = auth0.withApiAuthRequired(async (request: Request) => {
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

	const { name, country_code } = (await request.json()) as Body
	const result = await findDuplicateCandidates(name, country_code)
	return withCors(
		request,
		NextResponse.json(result, { headers: response.headers }),
	)
})
