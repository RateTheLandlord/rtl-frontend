import { getLandlords } from '@/lib/review/review'
import { runMiddleware } from '@/util/cors'
import applyRateLimit from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getLandlordsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	try {
		await applyRateLimit(req, res)
	} catch {
		return res.status(429).send('Too many requests')
	}

	const landlords = await getLandlords()

	res.status(200).json(landlords)
}

export default getLandlordsAPI
