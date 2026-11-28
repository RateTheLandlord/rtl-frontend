import { auth0 } from '@/lib/auth0'
import { NextResponse } from 'next/server'

export async function getAdminRouteAuth(requiredAdminId?: string) {
	const response = new NextResponse()
	const session = await auth0.getSession()
	const user = session?.user
	const authorized =
		user?.role === 'ADMIN' &&
		(!requiredAdminId || user.admin_id === requiredAdminId)

	return { response, authorized }
}
