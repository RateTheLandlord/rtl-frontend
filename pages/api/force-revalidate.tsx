import { runMiddleware } from '@/util/cors'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'

const handler = async (req, res) => {
	await runMiddleware(req, res)
	const session = await getSession(req, res)
	const user = session?.user

	const path = req.query.path

	console.log(`/landlord/${encodeURIComponent(path)}`)

	if (!path) {
		return res.status(401).json({ message: 'Invalid path' })
	}

	if (!user || user.role !== 'ADMIN') {
		return res.status(401).json({ message: 'Invalid token' })
	}

	try {
		await res.revalidate(`/landlord/${encodeURIComponent(path)}`)
		return res.json({ revalidated: true })
	} catch (err) {
		return res.status(500).send('Error revalidating')
	}
}
export default withApiAuthRequired(handler)
