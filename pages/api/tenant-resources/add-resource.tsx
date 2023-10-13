import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

interface IBody {
	name: string
	country_code: string
	city: string
	state: string
	address?: string
	phone_number?: string
	description: string
	href: string
}

const AddResource = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res)
	const url = process.env.API_URL as string

	const cookies = req.cookies
	const jwt: string = cookies.ratethelandlord || ''

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { body }: { body: IBody } = req

	fetch(`${url}/tenant-resource`, {
		method: 'POST',
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
			res.status(200).json(result)
		})
		.catch((error: Response) => {
			console.log('error: ', error)
			res
				.status(error.status)
				.json({ error: 'Failed to Add Resource', response: error.statusText })
		})
}

export default AddResource
