import { ResourceQuery, getResources } from '@/lib/tenant-resource/resource'
import applyRateLimit from '@/util/rateLimit'
import { NextApiRequest, NextApiResponse } from 'next'

const getTenantResources = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	try {
		await applyRateLimit(req, res)
	} catch {
		return res.status(429).send('Too many requests')
	}

	const queryParams: ResourceQuery = req.body.queryParams || {}

	const resources = await getResources(queryParams)

	res.status(200).json(resources)
}

export default getTenantResources
