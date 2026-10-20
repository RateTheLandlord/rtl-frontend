import { runMiddleware } from '@/util/cors'
import type { NextApiRequest, NextApiResponse } from 'next'
import rateLimitMiddleware from '@/util/rateLimit'
import { userUpdateReview } from '@/lib/review/models/user-update-review-layer'
import type { UserUpdatedReview } from '@/util/interfaces/interfaces'

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const isValidReview = (value: unknown): value is UserUpdatedReview => {
	if (!isRecord(value)) return false

	if (
		typeof value.landlord !== 'string' ||
		value.landlord.trim().length === 0 ||
		value.landlord.length > 150 ||
		typeof value.review !== 'string' ||
		value.review.trim().length === 0 ||
		value.review.length > 1000
	) {
		return false
	}

	const ratings = [
		value.repair,
		value.health,
		value.stability,
		value.privacy,
		value.respect,
	]

	if (
		!ratings.every(
			(rating) =>
				typeof rating === 'number' &&
				Number.isFinite(rating) &&
				rating >= 1 &&
				rating <= 5,
		)
	) {
		return false
	}

	return (
		value.rent === null ||
		(typeof value.rent === 'number' &&
			Number.isFinite(value.rent) &&
			value.rent >= 0)
	)
}

const UserEditReview = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await runMiddleware(req, res)

		if (req.method !== 'POST') {
			res.setHeader('Allow', 'POST')
			return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
		}

		if (!isRecord(req.body)) {
			return res.status(400).json({ error: 'INVALID_REQUEST_BODY' })
		}

		const { id, review, user_code } = req.body

		if (
			typeof id !== 'number' ||
			!Number.isSafeInteger(id) ||
			id <= 0 ||
			typeof user_code !== 'string' ||
			user_code.trim().length === 0 ||
			user_code.length > 256 ||
			!isValidReview(review)
		) {
			return res.status(400).json({ error: 'INVALID_REQUEST_BODY' })
		}

		const result = await userUpdateReview(id, review, user_code)
		return res.status(200).json(result)
	} catch (error) {
		console.error('Failed to update user review:', error)
		return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' })
	}
}

export default rateLimitMiddleware(UserEditReview)
