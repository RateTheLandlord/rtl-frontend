import { deleteResource } from '@/lib/tenantResource/resource'
import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '@/lib/auth0'

interface IBody {
	id: number
}

const deleteResourceAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const session = await auth0.getSession(req)
	const user = session?.user

	const { body } = req as { body: IBody }

	const id = body.id

	if (user && user.role === 'ADMIN') {
		const resource = await deleteResource(id)

		res.status(resource.status).json(resource.message)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default auth0.withApiAuthRequired(deleteResourceAPI)
