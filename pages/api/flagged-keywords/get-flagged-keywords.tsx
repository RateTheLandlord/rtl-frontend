import { getFlaggedKeywords } from '@/lib/flagged-keywords/flagged-keywords'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const landlords = await getFlaggedKeywords()

	res.status(200).json(landlords)
}

export default rateLimitMiddleware(handler)
