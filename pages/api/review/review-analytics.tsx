import { getTrailingReviews } from '@/lib/analytics/review'
import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

const getStats = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const stats = await getTrailingReviews(req.body)
	res.status(200).json(stats)
}

export default getStats
