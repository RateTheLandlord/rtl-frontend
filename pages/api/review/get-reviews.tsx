import { ReviewQuery, getReviews } from '@/lib/review/review'
import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

const getReviewsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const queryParams: ReviewQuery = req.body

	const reviews = await getReviews(queryParams)

	res.status(200).json(reviews)
}

export default getReviewsAPI
