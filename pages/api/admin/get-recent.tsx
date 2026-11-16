import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '@/lib/auth0'
import { getRecentReviews } from '@/lib/review/reviewTextMatch'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await auth0.getSession(req)
	const user = session?.user
	await runMiddleware(req, res)

	if (user && user.role === 'ADMIN') {
		const reviews = await getRecentReviews()
		res.status(200).json(reviews)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default auth0.withApiAuthRequired(handler)
