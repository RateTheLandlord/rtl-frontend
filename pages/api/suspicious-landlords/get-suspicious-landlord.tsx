import { getOneSuspiciousLandlord } from '@/lib/suspicious-landlords/suspicious-landlords'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getSuspiciousLandlordsAPI = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	const { query } = req
	const { landlord } = query
	const foundLandlord = await getOneSuspiciousLandlord(
		decodeURIComponent(landlord as string),
	)

	res.status(200).json(foundLandlord)
}

export default rateLimitMiddleware(getSuspiciousLandlordsAPI)
