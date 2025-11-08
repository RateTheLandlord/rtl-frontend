import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/captcha/verifyToken'
import rateLimitMiddleware from '@/util/rateLimit'
import { report } from '@/lib/review/models/user-report-review'

interface IBody {
	id: number
	flagged_reason: string
	captchaToken: string
}

const FlagReview = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const { body } = req as { body: IBody }

	const captcha = await verifyToken(body.captchaToken)

	if (captcha) {
		const reviews = await report(body.id, body.flagged_reason)
		res.status(200).json(reviews)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default rateLimitMiddleware(FlagReview)
