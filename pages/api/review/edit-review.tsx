import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { updateReview } from '@/lib/review/models/admin-update-review'
import { runMiddleware } from '@/util/cors'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Review } from '@/util/interfaces/interfaces'

const EditReview = async (req: NextApiRequest, res: NextApiResponse) => {
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

		const body = req.body as Partial<Review> | null

		if (
			!body ||
			typeof body !== 'object' ||
			!Number.isSafeInteger(body.id) ||
			typeof body.id !== 'number' ||
			body.id <= 0
		) {
			return res.status(400).json({ error: 'INVALID_REQUEST_BODY' })
		}

		const updatedReview = await updateReview(body.id, body as Review)

		return res.status(200).json(updatedReview)
	} catch (error) {
		console.error('Failed to edit review:', error)
		return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' })
	}
}

export default withApiAuthRequired(EditReview)
