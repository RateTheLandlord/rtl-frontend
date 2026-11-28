import { validateRuntimeEnvironment } from '@/lib/env'
import type { Instrumentation } from 'next'

export function register() {
	validateRuntimeEnvironment()
}

export const onRequestError: Instrumentation.onRequestError = (
	error,
	request,
	context,
) => {
	const errorDetails =
		error instanceof Error
			? {
					name: error.name,
					message: error.message,
					stack: error.stack,
				}
			: { message: String(error) }

	const digest =
		typeof error === 'object' && error !== null && 'digest' in error
			? String(error.digest)
			: undefined

	console.error(
		JSON.stringify({
			level: 'error',
			source: 'next-request-error',
			error: errorDetails,
			digest,
			method: request.method,
			path: request.path.split('?')[0],
			router: context.routerKind,
			route: context.routePath,
			routeType: context.routeType,
		}),
	)
}
