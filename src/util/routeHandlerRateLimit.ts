const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

export function checkRouteRateLimit(
	request: Request,
	limit = 20,
	windowMs = 60 * 1000,
): Response | null {
	const ip =
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		request.headers.get('x-real-ip') ||
		'unknown'
	const now = Date.now()
	const ipData = rateLimitMap.get(ip)

	if (!ipData) {
		rateLimitMap.set(ip, { count: 1, lastReset: now })
		return null
	}

	if (now - ipData.lastReset > windowMs) {
		ipData.count = 1
		ipData.lastReset = now
		return null
	}

	if (ipData.count >= limit) {
		return new Response('Too Many Requests', { status: 429 })
	}

	ipData.count += 1
	return null
}
