import { getSuspiciousLandlords } from '@/lib/suspicious-landlords/suspicious-landlords'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getSuspiciousLandlordsAPI = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	const resources = await getSuspiciousLandlords()

	res.status(200).json(resources)
}

export default rateLimitMiddleware(getSuspiciousLandlordsAPI)
