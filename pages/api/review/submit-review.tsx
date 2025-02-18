import { verifyToken } from '@/lib/captcha/verifyToken'
import { create } from '@/lib/review/review'
import { Review } from '@/util/interfaces/interfaces'
import ReviewRateLimitMiddleware from '@/util/reviewRateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

interface IBody {
	captchaToken: string
	review: Review
}

const SubmitReview = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body } = req as { body: IBody }

	const captcha = await verifyToken(body.captchaToken)

	if (captcha) {
		const review = await create(body.review)
		res.status(200).json(review)
	} else {
		res.status(401).json('UNAUTHORIZED')
	}
}

export default ReviewRateLimitMiddleware(SubmitReview)
