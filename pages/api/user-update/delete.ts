import { runMiddleware } from '@/util/cors'
import type { NextApiRequest, NextApiResponse } from 'next'
import rateLimitMiddleware from '@/util/rateLimit'
import { userDeleteReview } from '@/lib/review/models/user-delete-review-layer'

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const UserDeleteReview = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await runMiddleware(req, res)

		if (req.method !== 'POST') {
			res.setHeader('Allow', 'POST')
			return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
		}

		if (!isRecord(req.body)) {
			return res.status(400).json({ error: 'INVALID_REQUEST_BODY' })
		}

		const { id, user_code } = req.body

		if (
			typeof id !== 'number' ||
			!Number.isSafeInteger(id) ||
			id <= 0 ||
			typeof user_code !== 'string' ||
			user_code.trim().length === 0 ||
			user_code.length > 256
		) {
			return res.status(400).json({ error: 'INVALID_REQUEST_BODY' })
		}

		const result = await userDeleteReview(id, user_code)
		return res.status(200).json(result)
	} catch (error) {
		console.error('Failed to delete user review:', error)
		return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' })
	}
}

export default rateLimitMiddleware(UserDeleteReview)
