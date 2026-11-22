import { getSession } from '@auth0/nextjs-auth0'
import { NextResponse, type NextRequest } from 'next/server'

export async function getAdminRouteAuth(
	request: NextRequest,
	requiredAdminId?: string,
) {
	const response = new NextResponse()
	const session = await getSession(request, response)
	const user = session?.user
	const authorized =
		user?.role === 'ADMIN' &&
		(!requiredAdminId || user.admin_id === requiredAdminId)

	return { response, authorized }
}
