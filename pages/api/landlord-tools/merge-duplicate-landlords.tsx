import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '@/lib/auth0'
import {
	executeMergeTransaction,
	MergePayload,
} from '@/lib/admin/mergeLandlords'

const MergeDuplicateLandlords = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	await runMiddleware(req, res)
	const session = await auth0.getSession(req)
	const user = session?.user

	const { body } = req as { body: MergePayload }

	if (user && user.role === 'ADMIN') {
		const result = await executeMergeTransaction(body)
		res.status(200).json(result)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default auth0.withApiAuthRequired(MergeDuplicateLandlords)
