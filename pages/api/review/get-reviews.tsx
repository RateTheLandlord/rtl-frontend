import { ReviewQuery, getReviews } from '@/lib/review/review'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getReviewsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	const queryParams: ReviewQuery = req.body.queryParams || {}

	const reviews = await getReviews(queryParams)

	res.status(200).json(reviews)
}

export default rateLimitMiddleware(getReviewsAPI)
