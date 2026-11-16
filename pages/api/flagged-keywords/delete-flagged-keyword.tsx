import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '@/lib/auth0'
import { deleteKeyword } from '@/lib/flaggedKeywords/flaggedKeywords'

interface IBody {
	id: number
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const session = await auth0.getSession(req)
	const user = session?.user

	const { body } = req as { body: IBody }

	const id = body.id

	if (user && user.role === 'ADMIN' && user.admin_id === 'rtl-001') {
		const keyword = await deleteKeyword(id)

		res.status(keyword.status).json(keyword.message)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default auth0.withApiAuthRequired(handler)
