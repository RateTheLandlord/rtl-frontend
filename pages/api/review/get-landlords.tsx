import { getLandlords } from '@/lib/review/review'
import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

const getLandlordsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const landlords = await getLandlords()

	res.status(200).json(landlords)
}

export default getLandlordsAPI
