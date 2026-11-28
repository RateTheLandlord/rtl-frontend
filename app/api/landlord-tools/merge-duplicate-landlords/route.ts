import { auth0 } from '@/lib/auth0'
import { executeMergeTransaction } from '@/lib/admin/mergeLandlords'
import { parseJsonObject } from '@/util/parseJsonObject'
import { getAdminRouteAuth } from '@/util/routeHandlerAdmin'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'
import { NextResponse } from 'next/server'

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

	const body = await parseJsonObject(request)
	const { country, masterName, namesToMerge } = body ?? {}
	const isName = (value: unknown): value is string =>
		typeof value === 'string' && value.trim().length > 0

	if (
		typeof country !== 'string' ||
		!/^[A-Z]{2}$/.test(country) ||
		!isName(masterName) ||
		!Array.isArray(namesToMerge) ||
		namesToMerge.length === 0 ||
		!namesToMerge.every(isName)
	) {
		return withCors(
			request,
			NextResponse.json(
				{ success: false, rowsUpdated: 0, message: 'Invalid merge selection.' },
				{ status: 400, headers: response.headers },
			),
		)
	}

	const result = await executeMergeTransaction({
		country,
		masterName,
		namesToMerge,
	})
	return withCors(
		request,
		NextResponse.json(result, { headers: response.headers }),
	)
})
