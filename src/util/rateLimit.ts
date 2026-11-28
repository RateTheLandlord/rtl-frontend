import { NextApiRequest, NextApiResponse } from 'next'
import { isRateLimited } from '@/util/rateLimitStore'

export default function rateLimitMiddleware(
	handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		const ip = String(
			req.headers['x-forwarded-for'] ||
				req.headers['x-real-ip'] ||
				req.connection.remoteAddress ||
				'unknown',
		)
		if (isRateLimited(ip, 20, 60 * 1000)) {
			return res.status(429).send('Too Many Requests')
		}
		return handler(req, res)
	}
}
