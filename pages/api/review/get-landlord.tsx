/* eslint-disable no-useless-escape */
import { getLandlordReviews } from '@/lib/review/review'
import { runMiddleware } from '@/util/cors'
import applyRateLimit from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getLandlordAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	try {
		await applyRateLimit(req, res)
	} catch {
		return res.status(429).send('Too many requests')
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: { input: string } } = req

	const reviews = await getLandlordReviews(body.input)

	res.status(200).json(reviews)
}

export default getLandlordAPI
