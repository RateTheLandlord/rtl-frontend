import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { UserUpdatedReview } from '@/util/interfaces/interfaces'
import rateLimitMiddleware from '@/util/rateLimit'
import { userUpdateReview } from '@/lib/review/models/user-update-review-layer'

interface Body {
	review: UserUpdatedReview
	id: number
	user_code: string
}

const UserEditReview = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const { body } = req as { body: Body }

	const { id, review, user_code } = body
	if (!id || !review || !user_code) {
		res.status(400).json({ message: 'Missing Data' })
	} else {
		const result = await userUpdateReview(id, review, user_code)
		if (!result.success) {
			return res.status(400).json(result)
		}
		res.status(200).json(result)
	}
}

export default rateLimitMiddleware(UserEditReview)
