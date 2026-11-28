import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ResourceList from '@/components/resources/ResourceList'
import ResourcesContribution from '@/components/resources/ResourcesContribution'
import AdsComponent, { AD_UNITS } from '@/components/adsense/Adsense'
import { getResources } from '@/lib/tenantResource/resource'
import type { ResourceResponse } from '@/util/interfaces/Interfaces'
import { createPageMetadata, type SiteLocale } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: SiteLocale }>
}): Promise<Metadata> {
	const { locale } = await params
	return createPageMetadata({
		locale,
		path: '/resources',
		title:
			locale === 'fr-CA'
				? 'Ressources pour locataires | Rate The Landlord'
				: 'Tenant Resources | Rate The Landlord',
		description:
			locale === 'fr-CA'
				? 'Trouvez des ressources et des services utiles aux locataires selon leur région.'
				: 'Find tenant services and helpful resources by location.',
	})
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
