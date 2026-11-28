import { auth0 } from '@/lib/auth0'
import { executeMergeTransaction } from '@/lib/admin/mergeLandlords'
import type { MergePayload } from '@/lib/admin/mergeLandlords'
import { getAdminRouteAuth } from '@/util/routeHandlerAdmin'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse, type NextRequest } from 'next/server'

export const OPTIONS = auth0.withApiAuthRequired((request: NextRequest) =>
	handleCorsPreflight(request)!,
)

export const POST = auth0.withApiAuthRequired(async (request: NextRequest) => {
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

	const body = (await request.json()) as MergePayload
	const result = await executeMergeTransaction(body)
	return withCors(
		request,
		NextResponse.json(result, { headers: response.headers }),
	)
})
