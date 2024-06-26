/* eslint-disable no-useless-escape */
import { getLandlordSuggestions } from '@/lib/review/review'
import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

export const removeSpecialChars = (input: string) => {
	const specialCharsRegex = /[\/@#$%^*<>?\[\]{}|]/g
	return input.replace(specialCharsRegex, '')
}

const getLandlordSuggestionsAPI = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	await runMiddleware(req, res)

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: { input: string } } = req
	const sanitizedLandlord = removeSpecialChars(body.input)

	const landlords = await getLandlordSuggestions(sanitizedLandlord)

	res.status(200).json(landlords)
}

export default getLandlordSuggestionsAPI
