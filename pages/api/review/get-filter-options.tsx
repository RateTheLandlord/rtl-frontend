import { filterOptions } from '@/lib/review/filters'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getFilterOptionsAPI = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		return res.status(405).json({ message: 'Method not allowed' })
	}

	const {
		country = '',
		state = '',
		city = '',
	} = req.body as {
		country?: string
		state?: string
		city?: string
	}

	const dynamicallyFilteredOptions = await filterOptions(country, state, city)

	return res.status(200).json(dynamicallyFilteredOptions)
}

export default rateLimitMiddleware(getFilterOptionsAPI)
