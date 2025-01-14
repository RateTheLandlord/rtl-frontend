import { getChartData } from '@/lib/analytics/review'
import rateLimitMiddleware from '@/util/rateLimit'
import { ReviewQuery } from '@/lib/review/review'
import { NextApiRequest, NextApiResponse } from 'next'

const getChartStats = async (req: NextApiRequest, res: NextApiResponse) => {
	const queryParams: ReviewQuery = req.body.queryParams || {}

	const stats = await getChartData(queryParams)
	res.status(200).json(stats)
}

export default rateLimitMiddleware(getChartStats)
