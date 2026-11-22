import { isRateLimited } from '@/util/rateLimitStore'

export function checkRouteRateLimit(
	request: Request,
	limit = 20,
	windowMs = 60 * 1000,
): Response | null {
	const ip =
		request.headers.get('x-forwarded-for') ||
		request.headers.get('x-real-ip') ||
		'unknown'
	if (isRateLimited(ip, limit, windowMs)) {
		return new Response('Too Many Requests', { status: 429 })
	}
	return null
}
