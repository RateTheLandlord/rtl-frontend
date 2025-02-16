import { getLandlordSuggestions } from '@/lib/review/landlords'
import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

export const removeSpecialChars = (input: string) => {
	const specialCharsRegex = /[\/@#$%^*<>?\[\]{}|]/g
	return input.replace(specialCharsRegex, '')
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)

	const { body } = req as { body: { input: string } }
	const sanitizedLandlord = removeSpecialChars(body.input)

	const landlords = await getLandlordSuggestions(sanitizedLandlord)

	res.status(200).json(landlords)
}

export default handler
