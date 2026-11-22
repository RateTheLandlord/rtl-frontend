import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { create } from '@/lib/flaggedKeywords/flaggedKeywords'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import type { Keywords } from '@/util/interfaces/Interfaces'
import { NextResponse, type NextRequest } from 'next/server'

export const OPTIONS = withApiAuthRequired(async (request: NextRequest) =>
	handleCorsPreflight(request)!,
)

export const POST = withApiAuthRequired(async (request: NextRequest) => {
	const authResponse = new NextResponse()
	const session = await getSession(request, authResponse)
	const user = session?.user
	if (user?.role !== 'ADMIN' || user.admin_id !== 'rtl-001') {
		return withCors(
			request,
			NextResponse.json(
				{ error: 'UNAUTHORIZED' },
				{ status: 401, headers: authResponse.headers },
			),
		)
	}

	const body = (await request.json()) as Keywords
	const keyword = await create(body)
	return withCors(
		request,
		NextResponse.json(keyword.message, {
			status: keyword.status,
			headers: authResponse.headers,
		}),
	)
})
