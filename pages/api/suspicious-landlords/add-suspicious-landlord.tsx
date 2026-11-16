import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '@/lib/auth0'
import { create } from '@/lib/suspiciousLandlords/suspiciousLandlords'

interface IBody {
	landlord: string
	message: string
}

const AddResource = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const session = await auth0.getSession(req)
	const user = session?.user

	const { body } = req as { body: IBody }
	if (user && user.role === 'ADMIN' && user.admin_id === 'rtl-001') {
		const resource = await create(body)

		res.status(resource.status).json(resource.message)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default auth0.withApiAuthRequired(AddResource)
