import { filterOptions } from '@/lib/review/review'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getFilterOptionsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	const country: string = req.body.country || ""
	const state: string = req.body.state || ""
	const city: string = req.body.city || ""

	const dynamicallyFilteredOptions = await filterOptions(country, state, city)

	res.status(200).json(dynamicallyFilteredOptions)
}

export default rateLimitMiddleware(getFilterOptionsAPI)
