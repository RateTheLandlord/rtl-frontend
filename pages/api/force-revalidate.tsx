import { runMiddleware } from '@/util/cors'
import rateLimitMiddleware from '@/util/rateLimit'
import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const session = await getSession(req, res)
	const user = session?.user

	const path = req.query.path as string

	if (!path) {
		return res.status(401).json({ message: 'Invalid path' })
	}

	if (!user || user.role !== 'ADMIN') {
		return res.status(401).json({ message: 'Invalid token' })
	}

	try {
		await res.revalidate(`/landlord/${encodeURIComponent(path)}`)
		return res.json({ revalidated: true })
	} catch {
		return res.status(500).send('Error revalidating')
	}
}
export default rateLimitMiddleware(handler)
