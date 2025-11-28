import { ZipQuery } from '@/lib/review/types/Queries'
import { getZipInfo } from '@/lib/review/zip'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getZipStats = async (req: NextApiRequest, res: NextApiResponse) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const queryParams: ZipQuery = req.body || {}

	const reviews = await getZipInfo(queryParams)

	res.status(200).json(reviews)
}

export default rateLimitMiddleware(getZipStats)
