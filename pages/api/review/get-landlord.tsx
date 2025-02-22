import { getLandlordReviews } from '@/lib/review/landlords'
import { runMiddleware } from '@/util/cors'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const { body } = req as { body: { input: string } }

	const reviews = await getLandlordReviews(body.input)

	res.status(200).json(reviews)
}

export default rateLimitMiddleware(handler)
