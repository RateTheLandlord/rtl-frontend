/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import CityPage from '@/components/city/CityPage'
import Spinner from '@/components/ui/Spinner'
import { toTitleCase } from '@/util/helpers/toTitleCase'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { getCityReviews } from '@/lib/review/city'
import { ICityQuery } from '@/lib/review/types/Queries'
import { ICityReviews } from '@/lib/review/types/review'
import { readLocaleFile } from '@/util/readLocalFile'

interface IProps {
	city: string
	state: string
	country: string
	data: ICityReviews
}

const City = ({ city, state, country, data }: IProps) => {
	const title = `${toTitleCase(decodeURIComponent(city))}, ${toTitleCase(
		decodeURIComponent(state),
	)}, ${toTitleCase(decodeURIComponent(country))} Reviews | Rate The Landlord`
	const desc = `Looking to rent in ${toTitleCase(
		decodeURIComponent(city),
	)}? Read ${
		data?.total
	} landlord reviews and rental experiences for ${toTitleCase(
		decodeURIComponent(city),
	)}. Rate the Landlord is a community platform that elevates tenant voices to promote landlord accountability.`
	const siteURL = 'https://ratethelandlord.org'
	const pathName = useRouter().pathname
	const pageURL = pathName === '/' ? siteURL : siteURL + pathName
	const twitterHandle = '@r8thelandlord'
	const siteName = 'RateTheLandlord.org'

	if (!data?.reviews) return <Spinner />

	if (data?.reviews.length === 0) return <div>Error Loading Landlord</div>

	return (
		<>
			<NextSeo
				title={title}
				description={desc}
				canonical={pageURL}
				openGraph={{
					type: 'website',
					locale: 'en_CA',
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
				additionalMetaTags={[
					{
						property: 'author',
						content: title,
					},
				]}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `${siteURL}/favicon.ico`,
					},
				]}
			/>
			<CityPage city={city} state={state} country={country} data={data} />
		</>
	)
}

export function getStaticPaths() {
	return {
		paths: [],
		fallback: 'blocking',
	}
}

export async function getStaticProps({
	locale,
	params,
}: {
	locale: string
	params: ICityQuery
}) {
	const resourcesMessages = readLocaleFile('resources', locale)
	const alertsMessages = readLocaleFile('alerts', locale)
	const layoutMessages = readLocaleFile('layout', locale)
	const filtersMessages = readLocaleFile('filters', locale)
	const reviewsMessages = readLocaleFile('reviews', locale)
	const landlordMessages = readLocaleFile('landlord', locale)

	const data = await getCityReviews(params)

	if (!data || data.reviews.length === 0) {
		return {
			redirect: {
				permanent: false,
				destination: '/404',
			},
		}
	}

	return {
		props: {
			city: params.city,
			state: params.state,
			country: params.country_code,
			data: JSON.parse(JSON.stringify(data)),
			messages: {
				...resourcesMessages,
				...alertsMessages,
				...layoutMessages,
				...reviewsMessages,
				...filtersMessages,
				...landlordMessages,
			},
		},

		// Re-generate the page
		// if a request comes in after 100 seconds
		revalidate: 100,
	}
}

export default City
