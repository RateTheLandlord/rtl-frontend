const allowedMethods = 'GET,HEAD,PUT,PATCH,POST,DELETE'

export function handleCorsPreflight(request: Request): Response | null {
	if (request.method !== 'OPTIONS') return null

	const headers = new Headers({
		'Access-Control-Allow-Methods': allowedMethods,
	})
	const requestedHeaders = request.headers.get('Access-Control-Request-Headers')
	if (requestedHeaders) {
		headers.set('Access-Control-Allow-Headers', requestedHeaders)
	}
	applyAllowedOrigin(request, headers)
	return new Response(null, { status: 204, headers })
}

export function withCors(request: Request, response: Response): Response {
	const headers = new Headers(response.headers)
	applyAllowedOrigin(request, headers)
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	})
}

function applyAllowedOrigin(request: Request, headers: Headers) {
	const origin = request.headers.get('Origin')
	if (origin && origin === process.env.ORIGIN_URL) {
		headers.set('Access-Control-Allow-Origin', origin)
		headers.append('Vary', 'Origin')
	}
}
