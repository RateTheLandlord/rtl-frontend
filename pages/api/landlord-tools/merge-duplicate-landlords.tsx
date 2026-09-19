import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import {
	executeMergeTransaction,
	MergePayload,
} from '@/lib/admin/merge-landlords'

const MergeDuplicateLandlords = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	await runMiddleware(req, res)
	const session = await getSession(req, res)
	const user = session?.user

	const { body } = req as { body: MergePayload }

	if (user && user.role === 'ADMIN') {
		const result = await executeMergeTransaction(body)
		res.status(200).json(result)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default withApiAuthRequired(MergeDuplicateLandlords)
