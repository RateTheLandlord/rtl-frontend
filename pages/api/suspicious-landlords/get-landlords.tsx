import { getSuspiciousLandlords } from '@/lib/suspicious-landlords/suspicious-landlords'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getSuspiciousLandlordsAPI = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	const landlords = await getSuspiciousLandlords()

	res.status(200).json(landlords)
}

export default rateLimitMiddleware(getSuspiciousLandlordsAPI)
