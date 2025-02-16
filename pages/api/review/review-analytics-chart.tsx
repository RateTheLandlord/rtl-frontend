import { getChartData } from '@/lib/analytics/review'
import { ReviewQuery } from '@/lib/review/types/Queries'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getChartStats = async (req: NextApiRequest, res: NextApiResponse) => {
	const { queryParams = {} } = req.body as { queryParams: ReviewQuery }

	const stats = await getChartData(queryParams)
	res.status(200).json(stats)
}

export default rateLimitMiddleware(getChartStats)
