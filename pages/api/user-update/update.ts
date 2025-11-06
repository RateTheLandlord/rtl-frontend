import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { UserUpdatedReview } from '@/util/interfaces/interfaces'
import { userUpdateReview } from '@/lib/review/models/review-data-layer'
import rateLimitMiddleware from '@/util/rateLimit'

interface Body {
	review: UserUpdatedReview
	id: number
	user_code: string
}

const UserEditReview = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const { body } = req as { body: Body }

	const { id, review, user_code } = body
	const result = await userUpdateReview(id, review, user_code)
	res.status(200).json(result)
}

export default rateLimitMiddleware(UserEditReview)
