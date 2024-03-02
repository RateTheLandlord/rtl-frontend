import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { report } from '@/lib/review/review'
import { verifyToken } from '@/lib/captcha/verifyToken'
import applyRateLimit from '@/util/rateLimit'

interface IBody {
	id: number
	flagged_reason: string
	captchaToken: string
}

const FlagReview = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	try {
		await applyRateLimit(req, res)
	} catch {
		return res.status(429).send('Too many requests')
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: IBody } = req

	const captcha = await verifyToken(body.captchaToken)

	if (captcha) {
		const reviews = await report(body.id, body.flagged_reason)
		res.status(200).json(reviews)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default FlagReview
