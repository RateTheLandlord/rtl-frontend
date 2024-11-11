import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { create } from '@/lib/suspicious-landlords/suspicious-landlords'

interface IBody {
	landlord: string
	message: string
}

const AddResource = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const session = await getSession(req, res)
	const user = session?.user

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: IBody } = req
	if (user && user.role === 'ADMIN' && user.admin_id === 'rtl-001') {
		const resource = await create(body)

		res.status(resource.status).json(resource.message)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default withApiAuthRequired(AddResource)
