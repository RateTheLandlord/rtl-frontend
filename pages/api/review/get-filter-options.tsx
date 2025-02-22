import { filterOptions } from '@/lib/review/filters'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getFilterOptionsAPI = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	const {
		country = '',
		state = '',
		city = '',
	} = req.body as { country?: string; state?: string; city?: string }

	const dynamicallyFilteredOptions = await filterOptions(country, state, city)

	res.status(200).json(dynamicallyFilteredOptions)
}

export default rateLimitMiddleware(getFilterOptionsAPI)
