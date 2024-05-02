/* eslint-disable no-useless-escape */
import { getLandlordReviews } from '@/lib/review/review'
import { runMiddleware } from '@/util/cors'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getLandlordAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: { input: string } } = req

	const reviews = await getLandlordReviews(body.input)

	res.status(200).json(reviews)
}

export default rateLimitMiddleware(getLandlordAPI)
