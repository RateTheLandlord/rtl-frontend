import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '@/lib/auth0'
import { deleteLandlord } from '@/lib/suspiciousLandlords/suspiciousLandlords'

interface IBody {
	id: number
}

const deleteLandlordAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const session = await auth0.getSession(req)
	const user = session?.user

	const { body } = req as { body: IBody }

	const id = body.id

	if (user && user.role === 'ADMIN' && user.admin_id === 'rtl-001') {
		const landlord = await deleteLandlord(id)

		res.status(landlord.status).json(landlord.message)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default auth0.withApiAuthRequired(deleteLandlordAPI)
