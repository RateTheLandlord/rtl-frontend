import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ResourceList from '@/components/resources/ResourceList'
import ResourcesContribution from '@/components/resources/ResourcesContribution'
import AdsComponent, { AD_UNITS } from '@/components/adsense/Adsense'
import { getResources } from '@/lib/tenantResource/resource'
import type { ResourceResponse } from '@/util/interfaces/Interfaces'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
	title: 'Resources',
	description:
		'Find resources for tenants. We are a community platform that elevates tenant voices to promote landlord accountability.',
	alternates: {
		canonical: 'https://ratethelandlord.org/resources',
	},
	openGraph: {
		type: 'website',
		url: 'https://ratethelandlord.org/resources',
		title: 'Resources | Rate The Landlord',
		description:
			'Find resources for tenants. We are a community platform that elevates tenant voices to promote landlord accountability.',
	},
}

export default async function ResourcesPage() {
	const resources = await getResources({})
	if (!resources?.resources.length) notFound()

	const data = JSON.parse(JSON.stringify(resources)) as ResourceResponse

	return (
		<main className='flex w-full justify-center'>
			<div className='container mt-5 flex flex-col items-center gap-4 px-2'>
				<AdsComponent slot={AD_UNITS.RESOURCES} />
				<ResourceList data={data} />
				<ResourcesContribution />
			</div>
		</main>
	)
}
