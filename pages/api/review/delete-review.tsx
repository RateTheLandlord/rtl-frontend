import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { deleteReview } from '@/lib/review/models/admin-delete-review'
import { runMiddleware } from '@/util/cors'
import type { NextApiRequest, NextApiResponse } from 'next'

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await runMiddleware(req, res)

		if (req.method !== 'POST') {
			res.setHeader('Allow', 'POST')
			return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
		}

		const session = await getSession(req, res)

		if (session?.user?.role !== 'ADMIN') {
			return res.status(403).json({ error: 'FORBIDDEN' })
		}

		const body: unknown = req.body

		if (
			!body ||
			typeof body !== 'object' ||
			!('id' in body) ||
			typeof body.id !== 'number' ||
			!Number.isSafeInteger(body.id) ||
			body.id <= 0
		) {
			return res.status(400).json({ error: 'INVALID_REQUEST_BODY' })
		}

		const deleted = await deleteReview(body.id)

		if (!deleted) {
			return res.status(404).json({ error: 'REVIEW_NOT_FOUND' })
		}

		return res.status(200).json({ message: 'Review deleted' })
	} catch (error) {
		console.error('Failed to delete review:', error)
		return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' })
	}
}

export default withApiAuthRequired(handle)
