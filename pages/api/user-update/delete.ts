import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import rateLimitMiddleware from '@/util/rateLimit'
import { userDeleteReview } from '@/lib/review/models/user-delete-review-layer'

interface Body {
	id: number
	user_code: string
}

const UserEditReview = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const { body } = req as { body: Body }

	const { id, user_code } = body
	if (!id || !user_code) {
		res.status(400).json({ message: 'Missing Data' })
	} else {
		const result = await userDeleteReview(id, user_code)
		res.status(200).json(result)
	}
}

export default rateLimitMiddleware(UserEditReview)
