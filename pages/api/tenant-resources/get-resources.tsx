import { getResources } from '@/lib/tenant-resource/resource'
import { runMiddleware } from '@/util/cors'
import { NextApiRequest, NextApiResponse } from 'next'

const getTenantResources = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	await runMiddleware(req, res)

	const resources = await getResources(req.query)

	res.status(200).json(resources)
}

export default getTenantResources
