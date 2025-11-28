import { getReviews } from '@/lib/review/models/user-get-reviews'
import { ReviewQuery } from '@/lib/review/types/Queries'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getReviewsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	const queryParams: ReviewQuery =
		(req.body as { queryParams: ReviewQuery }).queryParams || {}

	const reviews = await getReviews(queryParams)

	res.status(200).json(reviews)
}

export default rateLimitMiddleware(getReviewsAPI)
