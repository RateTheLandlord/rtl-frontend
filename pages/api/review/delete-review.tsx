import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { deleteReview } from '@/lib/review/review'

interface IBody {
	id: number
}

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession(req, res)
	const user = session?.user
	await runMiddleware(req, res)

	const { body } = req as { body: IBody }

	const id = body.id

	if (user && user.role === 'ADMIN') {
		await deleteReview(id)
		res.status(200).json('Review Deleted')
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default withApiAuthRequired(handle)
