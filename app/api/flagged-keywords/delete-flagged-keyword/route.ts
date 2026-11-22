import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { deleteKeyword } from '@/lib/flaggedKeywords/flaggedKeywords'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
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

	const { id } = (await request.json()) as { id: number }
	const keyword = await deleteKeyword(id)
	return withCors(
		request,
		NextResponse.json(keyword.message, {
			status: keyword.status,
			headers: authResponse.headers,
		}),
	)
})
