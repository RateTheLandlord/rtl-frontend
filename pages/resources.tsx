import ResourcesInfo from '@/components/resources/resourcesInfo'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import AdsComponent from '@/components/adsense/Adsense'
import ResourceList from '@/components/resources/ResourceList'
import { ResourceResponse } from '@/util/interfaces/interfaces'
import { getResources } from '@/lib/tenant-resource/resource'
import { useTranslation } from 'react-i18next'

interface IProps {
	data: ResourceResponse
}

function Resources({ data }: IProps): JSX.Element {
	const title = 'Resources | Rate The Landlord'
	const desc =
		'Find resources for Tenants. We are a community platform that elevates tenant voices to promote landlord accountability.'

	const siteURL = 'https://ratethelandlord.org'
	const pathName = useRouter().pathname
	const pageURL = pathName === '/' ? siteURL : siteURL + pathName
	const twitterHandle = '@r8thelandlord'
	const siteName = 'RateTheLandlord.org'
	const { t } = useTranslation('resourcesPage')
	return (
		<div className='flex w-full justify-center'>
			<NextSeo
				title={title}
				description={desc}
				canonical={pageURL}
				openGraph={{
					type: 'website',
					locale: 'en_CA', //  Default is en_US
					url: pageURL,
					title,
					description: desc,

					site_name: siteName,
				}}
				twitter={{
					handle: twitterHandle,
					site: twitterHandle,
					cardType: 'summary_large_image',
				}}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `${siteURL}/favicon.ico`,
					},
				]}
			/>
			<div className='container mt-5 flex flex-col items-center gap-4 px-2'>
				<AdsComponent slot='9611751505' />
				<ResourcesInfo />
				<ResourceList data={data} />
				<p className='mt-8 text-center text-xl leading-8 text-gray-500'>
					{t('resources.contribute')}
				</p>
			</div>
		</div>
	)
}

export default Resources

//Page is statically generated at build time and then revalidated at a minimum of every 30 minutes based on when the page is accessed
export async function getStaticProps() {
	const data = await getResources({})
	if (data) {
		return {
			props: JSON.parse(JSON.stringify({ data: data })),
			revalidate: 100,
		}
	} else {
		return {
			props: {
				data: [],
			},
			revalidate: 100,
		}
	}
}
