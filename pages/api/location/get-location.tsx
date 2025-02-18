import { getLocations } from '@/lib/location/location'
import { runMiddleware } from '@/util/cors'
import { Options } from '@/util/interfaces/interfaces'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getLocationApi = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const { zipCodes, country_code } = req.body as {
		zipCodes: Options[]
		country_code: string
	}

	const locations = await getLocations(zipCodes, country_code)

	res.status(200).json(locations)
}

export default rateLimitMiddleware(getLocationApi)
