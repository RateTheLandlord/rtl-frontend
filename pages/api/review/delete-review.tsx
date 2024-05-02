import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { deleteReview } from '@/lib/review/review'
import rateLimitMiddleware from '@/util/rateLimit'

interface IBody {
	id: number
}

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession(req, res)
	const user = session?.user
	await runMiddleware(req, res)

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: IBody } = req

	const id = body.id

	if (user && user.role === 'ADMIN') {
		deleteReview(id)
		res.status(200).json('Review Deleted')
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default rateLimitMiddleware(withApiAuthRequired(handle))
