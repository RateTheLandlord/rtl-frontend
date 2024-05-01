const rateLimitMap = new Map()

export default function rateLimitMiddleware(handler) {
	return (req, res) => {
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
		const limit = 2 // Limiting requests to 5 per minute per IP
		const windowMs = 604800000 //1 week

		if (!rateLimitMap.has(ip)) {
			rateLimitMap.set(ip, {
				count: 0,
				lastReset: Date.now(),
			})
		}

		const ipData = rateLimitMap.get(ip)

		if (Date.now() - ipData.lastReset > windowMs) {
			ipData.count = 0
			ipData.lastReset = Date.now()
		}

		if (ipData.count >= limit) {
			return res.status(429).send('Too Many Requests')
		}

		ipData.count += 1

		return handler(req, res)
	}
}
