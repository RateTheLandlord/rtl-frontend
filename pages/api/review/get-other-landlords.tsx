import { getOtherLandlords } from '@/lib/review/landlords'
import { runMiddleware } from '@/util/cors'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const landlord = req.query.landlord || ''

	const landlords = await getOtherLandlords(
		decodeURIComponent(landlord as string),
	)

	res.status(200).json(landlords)
}

export default rateLimitMiddleware(handler)
