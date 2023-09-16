import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
	methods: ['POST', 'GET', 'HEAD', 'DELETE', 'PUT'],
	origin: process.env.ORIGIN_URL as string,
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(req: NextApiRequest, res: NextApiResponse) {
	return new Promise((resolve, reject) => {
		cors(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result)
			}

			return resolve(result)
		})
	})
}
