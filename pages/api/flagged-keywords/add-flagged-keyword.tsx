import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '@/lib/auth0'
import { create } from '@/lib/flaggedKeywords/flaggedKeywords'

interface IBody {
	keyword: string
	reason: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const session = await auth0.getSession(req)
	const user = session?.user

	const { body } = req as { body: IBody }
	if (user && user.role === 'ADMIN' && user.admin_id === 'rtl-001') {
		const keyword = await create(body)

		res.status(keyword.status).json(keyword.message)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default auth0.withApiAuthRequired(handler)
