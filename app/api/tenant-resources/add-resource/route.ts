import { auth0 } from '@/lib/auth0'
import { create } from '@/lib/tenantResource/resource'
import type { Resource } from '@/lib/tenantResource/models/resource'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse, type NextRequest } from 'next/server'

export const OPTIONS = auth0.withApiAuthRequired(async (request: NextRequest) =>
	handleCorsPreflight(request)!,
)

export const POST = auth0.withApiAuthRequired(async (request: NextRequest) => {
	const authResponse = new NextResponse()
	const session = await auth0.getSession(request)
	if (session?.user?.role !== 'ADMIN') {
		return withCors(
			request,
			NextResponse.json(
				{ error: 'UNAUTHORIZED' },
				{ status: 401, headers: authResponse.headers },
			),
		)
	}

	const body = (await request.json()) as Resource
	const resource = await create(body)
	return withCors(
		request,
		NextResponse.json(resource.message, {
			status: resource.status,
			headers: authResponse.headers,
		}),
	)
})
