import { ZipQuery, getZipInfo } from '@/lib/review/review'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getZipStats = async (req: NextApiRequest, res: NextApiResponse) => {
	const queryParams: ZipQuery = req.body || {}

	const reviews = await getZipInfo(queryParams)

	res.status(200).json(reviews)
}

export default rateLimitMiddleware(getZipStats)
