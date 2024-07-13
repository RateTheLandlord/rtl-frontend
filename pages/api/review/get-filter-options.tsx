import { filterOptions, ReviewQuery } from '@/lib/review/review'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getFilterOptionsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	const queryParams: ReviewQuery = req.body.queryParams || {}

	const dynamicallyFilteredOptions = await filterOptions(queryParams.country, queryParams.state, queryParams.city)

	res.status(200).json(dynamicallyFilteredOptions)
}

export default rateLimitMiddleware(getFilterOptionsAPI)
