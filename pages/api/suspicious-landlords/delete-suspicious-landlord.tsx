import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { deleteLandlord } from '@/lib/suspicious-landlords/suspicious-landlords'

interface IBody {
	id: number
}

const deleteLandlordAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const session = await getSession(req, res)
	const user = session?.user

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: IBody } = req

	const id = body.id

	if (user && user.role === 'ADMIN' && user.admin_id === 'rtl-001') {
		const landlord = await deleteLandlord(id)

		res.status(landlord.status).json(landlord.message)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default withApiAuthRequired(deleteLandlordAPI)
