import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { findDuplicateCandidates } from '@/lib/landlord-tools/search-duplicate-landlords'

type Body = {
	name: string
	country_code: string
}

const SearchDuplicateLandlords = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	await runMiddleware(req, res)
	const session = await getSession(req, res)
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

export default withApiAuthRequired(SearchDuplicateLandlords)
