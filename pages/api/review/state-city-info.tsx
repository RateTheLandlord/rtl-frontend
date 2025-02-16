import { getTopCitiesStats } from '@/lib/review/state-stats'
import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

const getTopCityStats = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const stats = await getTopCitiesStats(req.body)
	res.status(200).json(stats)
}

export default getTopCityStats
