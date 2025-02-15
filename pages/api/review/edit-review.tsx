import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { update } from '@/lib/review/review'
import { Review } from '@/util/interfaces/interfaces'

const EditReview = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession(req, res)
	const user = session?.user
	await runMiddleware(req, res)

	const { body }: { body: Review } = req

	const id = body.id

	if (user && user.role === 'ADMIN') {
		const reviews = await update(id || 0, body)
		res.status(200).json(reviews)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default withApiAuthRequired(EditReview)
