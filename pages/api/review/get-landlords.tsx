import { getLandlords } from '@/lib/review/landlords'
import { runMiddleware } from '@/util/cors'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const landlords = await getLandlords()

	res.status(200).json(landlords)
}

export default rateLimitMiddleware(handler)
