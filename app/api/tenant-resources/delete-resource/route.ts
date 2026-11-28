import { auth0 } from '@/lib/auth0'
import { deleteResource } from '@/lib/tenantResource/resource'
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

	const body = (await request.json()) as { id: number }
	const resource = await deleteResource(body.id)
	return withCors(
		request,
		NextResponse.json(resource.message, {
			status: resource.status,
			headers: authResponse.headers,
		}),
	)
})
