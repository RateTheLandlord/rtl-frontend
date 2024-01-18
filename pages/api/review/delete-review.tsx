import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { useUser } from '@auth0/nextjs-auth0/client'

interface IBody {
	id: number
}

const deleteReview = async (req: NextApiRequest, res: NextApiResponse) => {
	const { user } = useUser()
	await runMiddleware(req, res)
	const url = process.env.API_URL as string

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: IBody } = req

	const id = body.id

	if (user && user.role === 'ADMIN') {
		fetch(`${url}/review/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((result: Response) => {
				if (!result.ok) {
					console.log(result)
					throw result
				}
				return result.json()
			})
			.then((data) => {
				res.status(200).json(data)
			})
			.catch((err: Response) => {
				console.log(err)
				res
					.status(err.status)
					.json({ error: 'Failed to delete Review', response: err.statusText })
			})
	} else {
		res.status(401).json({ error: 'UNAUTHORIZED' })
	}
}

export default deleteReview
