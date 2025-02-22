/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Spinner from '@/components/ui/Spinner'
import ZipPage from '@/components/zip/ZipPage'
import { toTitleCase } from '@/util/helpers/toTitleCase'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { IZipReviews } from '@/lib/review/types/review'
import { getZipReviews } from '@/lib/review/zip'

interface IProps {
	city: string
	state: string
	country: string
	zip: string
	data: IZipReviews
}

const Zip = ({ city, state, country, zip, data }: IProps) => {
	const title = `${decodeURIComponent(zip).toLocaleUpperCase()}, ${toTitleCase(
		decodeURIComponent(state),
	)}, ${toTitleCase(decodeURIComponent(country))} Reviews | Rate The Landlord`
	const desc = `Looking to rent in ${toTitleCase(
		decodeURIComponent(zip),
	)}? Read ${
		data?.total
	} landlord reviews and rental experiences for ${toTitleCase(
		decodeURIComponent(zip),
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
			<ZipPage
				city={city}
				state={state}
				country={country}
				zip={zip}
				data={data}
			/>
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
	params: { city: string; state: string; country_code: string; zip: string }
}) {
	const alertsMessages = (await import(
		`@/messages/${locale}/alerts.json`
	)) as Record<string, string>
	const layoutMessages = (await import(
		`@/messages/${locale}/layout.json`
	)) as Record<string, string>
	const resourcesMessages = (await import(
		`@/messages/${locale}/resources.json`
	)) as Record<string, string>
	const filtersMessages = (await import(
		`@/messages/${locale}/filters.json`
	)) as Record<string, string>
	const landlordMessages = (await import(
		`@/messages/${locale}/landlord.json`
	)) as Record<string, string>
	const reviewsMessages = (await import(
		`@/messages/${locale}/reviews.json`
	)) as Record<string, string>
	const data = await getZipReviews(params)

	if (data.reviews.length === 0) {
		return {
			redirect: {
				permanent: false,
				destination: '/404',
			},
		}
	}

	// Pass post data to the page via props
	return {
		props: JSON.parse(
			JSON.stringify({
				city: params.city,
				state: params.state,
				country: params.country_code,
				data: data,
				zip: params.zip,
				messages: {
					...alertsMessages,
					...layoutMessages,
					...filtersMessages,
					...resourcesMessages,
					...landlordMessages,
					...reviewsMessages,
				},
			}),
		),
		// Re-generate the page
		// if a request comes in after 100 seconds
		revalidate: 100,
	}
}

export default Zip
