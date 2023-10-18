import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

interface IBody {
	id: number
}

const deleteResource = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const url = process.env.API_URL as string

	const cookies = req.cookies
	const jwt: string = cookies.ratethelandlord || ''

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: IBody } = req

	const id = body.id

	fetch(`${url}/tenant-resource/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${jwt}`,
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
				.json({ error: 'Failed to delete Resource', response: err.statusText })
		})
}

export default deleteResource
