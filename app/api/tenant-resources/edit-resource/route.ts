import { auth0 } from '@/lib/auth0'
import { update } from '@/lib/tenantResource/resource'
import type { Resource } from '@/lib/tenantResource/models/resource'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse } from 'next/server'

export const OPTIONS = auth0.withApiAuthRequired((request: Request) =>
	handleCorsPreflight(request)!,
)

export const POST = auth0.withApiAuthRequired(async (request: Request) => {
	const authResponse = new NextResponse()
	const session = await auth0.getSession()
	if (session?.user?.role !== 'ADMIN') {
		return withCors(
			request,
			NextResponse.json(
				{ error: 'UNAUTHORIZED' },
				{ status: 401, headers: authResponse.headers },
			),
		)
	}

	const body = (await request.json()) as Resource & { id: number }
	const resource = await update(body.id, body)
	return withCors(
		request,
		NextResponse.json(resource.message, {
			status: resource.status,
			headers: authResponse.headers,
		}),
	)
})
