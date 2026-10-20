import { verifyToken } from '@/lib/captcha/verifyToken'
import { create } from '@/lib/review/models/review-data-layer'
import type { Review } from '@/util/interfaces/interfaces'
import ReviewRateLimitMiddleware from '@/util/reviewRateLimit'
import type { NextApiRequest, NextApiResponse } from 'next'

const SubmitReview = async (
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<void> => {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST')
		res.status(405).json({ message: 'Method Not Allowed' })
		return
	}

	const body: unknown = req.body

	if (
		typeof body !== 'object' ||
		body === null ||
		Array.isArray(body) ||
		!('captchaToken' in body) ||
		typeof body.captchaToken !== 'string' ||
		!body.captchaToken.trim() ||
		!('review' in body) ||
		typeof body.review !== 'object' ||
		body.review === null ||
		Array.isArray(body.review)
	) {
		res.status(400).json({ message: 'Invalid request body' })
		return
	}

	try {
		const captchaValid = await verifyToken(body.captchaToken)

		if (!captchaValid) {
			res.status(401).json('UNAUTHORIZED')
			return
		}

		const result = await create(body.review as Review)
		res.status(200).json(result)
	} catch (error) {
		console.error('Error submitting review:', error)
		res.status(500).json({ message: 'Unable to submit review' })
	}
}

export default ReviewRateLimitMiddleware(SubmitReview)
