import { getStateStats } from '@/lib/review/state-stats'
import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

const getStats = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const stats = await getStateStats(req.body)
	res.status(200).json(stats)
}

export default getStats
