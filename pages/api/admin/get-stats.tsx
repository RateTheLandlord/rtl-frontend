import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { get } from '@/lib/stats/stats'

const getStats = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const session = await getSession(req, res)
	const user = session?.user

	if (user && user.role === 'ADMIN') {
		const stats = await get(req.query)
		res.status(200).json(stats)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default withApiAuthRequired(getStats)
