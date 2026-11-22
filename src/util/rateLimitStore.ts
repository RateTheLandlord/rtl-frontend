const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

export function isRateLimited(
	key: string,
	limit: number,
	windowMs: number,
): boolean {
	const now = Date.now()
	const ipData = rateLimitMap.get(key)

	if (!ipData) {
		rateLimitMap.set(key, { count: 1, lastReset: now })
		return false
	}

	if (now - ipData.lastReset > windowMs) {
		ipData.count = 1
		ipData.lastReset = now
		return false
	}

	if (ipData.count >= limit) return true

	ipData.count += 1
	return false
}
