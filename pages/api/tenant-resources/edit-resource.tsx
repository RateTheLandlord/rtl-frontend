import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

interface IBody {
	id: number
}

const EditResource = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const url = process.env.API_URL as string

	const cookies = req.cookies
	const jwt: string = cookies.ratethelandlord || ''

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: IBody } = req

	const id = body.id

	fetch(`${url}/tenant-resource/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify(body),
	})
		.then((result: Response) => {
			if (!result.ok) {
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
				.json({ error: 'Failed to edit Resource', response: err.statusText })
		})
}

export default EditResource
