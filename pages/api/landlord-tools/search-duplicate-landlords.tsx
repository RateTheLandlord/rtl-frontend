import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth0 } from '@/lib/auth0'
import { findDuplicateCandidates } from '@/lib/landlordTools/searchDuplicateLandlords'

type Body = {
	name: string
	country_code: string
}

const SearchDuplicateLandlords = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	await runMiddleware(req, res)
	const session = await auth0.getSession(req)
	const user = session?.user

	const { body } = req as { body: Body }

	const { name, country_code } = body

	if (user && user.role === 'ADMIN') {
		const result = await findDuplicateCandidates(name, country_code)
		res.status(200).json(result)
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default auth0.withApiAuthRequired(SearchDuplicateLandlords)
