import { ResourceQuery, getResources } from '@/lib/tenant-resource/resource'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getTenantResources = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	const queryParams: ResourceQuery = req.body.queryParams || {}

	const resources = await getResources(queryParams)

	res.status(200).json(resources)
}

export default rateLimitMiddleware(getTenantResources)
