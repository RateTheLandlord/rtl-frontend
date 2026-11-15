import { getResources } from '@/lib/tenantResource/resource'
import { ResourceQuery } from '@/lib/tenantResource/Types'
import rateLimitMiddleware from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getTenantResources = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	const queryParams: ResourceQuery =
		(req.body as { queryParams: ResourceQuery }).queryParams || {}

	const resources = await getResources(queryParams)

	res.status(200).json(resources)
}

export default rateLimitMiddleware(getTenantResources)
