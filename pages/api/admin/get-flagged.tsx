import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { getFlagged } from '@/lib/review/review'

const getReviews = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession(req, res)
	const user = session?.user
	await runMiddleware(req, res)

	if (user && user.role === 'ADMIN') {
		const reviews = getFlagged()
		res.status(200).json(reviews)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default withApiAuthRequired(getReviews)
