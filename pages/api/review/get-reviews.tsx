import { ReviewQuery, getReviews } from '@/lib/review/review'
import applyRateLimit from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getReviewsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await applyRateLimit(req, res)
	} catch {
		return res.status(429).send('Too many requests')
	}
	const queryParams: ReviewQuery = req.body.queryParams

	const reviews = await getReviews(queryParams)

	res.status(200).json(reviews)
}

export default getReviewsAPI
