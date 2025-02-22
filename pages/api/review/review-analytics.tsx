import { getTrailingReviews } from '@/lib/analytics/review'
import { ReviewQuery } from '@/lib/review/types/Queries'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getStats = async (req: NextApiRequest, res: NextApiResponse) => {
	const { queryParams = {} } = req.body as { queryParams: ReviewQuery }

	const stats = await getTrailingReviews(queryParams)
	res.status(200).json(stats)
}

export default rateLimitMiddleware(getStats)
