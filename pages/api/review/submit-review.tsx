import { verifyToken } from '@/lib/captcha/verifyToken'
import { create } from '@/lib/review/review'
import ReviewRateLimitMiddleware from '@/util/reviewRateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

interface IBody {
	captchaToken: string
	review: {
		landlord: string
		country_code: string
		city: string
		state: string
		review: string
		zip: string
		repair: number
		health: number
		stability: number
		privacy: number
		respect: number
		flagged: boolean
		flagged_reason: string
		admin_approved: boolean
		admin_edited: boolean
		rent: number | null
		date_added: Date
		moderation_reason: string | null
	}
}

const SubmitReview = async (req: NextApiRequest, res: NextApiResponse) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: IBody } = req

	const captcha = await verifyToken(body.captchaToken)

	if (captcha) {
		const review = await create(body.review)
		res.status(200).json(review)
	} else {
		res.status(401).json('UNAUTHORIZED')
	}
}

export default ReviewRateLimitMiddleware(SubmitReview)
