/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import LandlordPage from '@/components/landlord/LandlordPage'
import Spinner from '@/components/ui/Spinner'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { getLandlordReviews } from '@/lib/review/landlords'
import { ILandlordReviews } from '@/lib/review/types/Queries'

interface IProps {
	landlord: string
	data: ILandlordReviews
}

const Landlord = ({ landlord, data }: IProps) => {
	const pathName = useRouter().pathname
	if (!data) return <div>Error Loading Landlord</div>

	if (!data.reviews) return <Spinner />

	if (data.total === 0) return <div>Error Loading Landlord</div>

	const title = `${decodeURIComponent(landlord)} Reviews | Rate The Landlord`
	const desc = `Reviews for ${landlord}. Read ${data.total} reviews and rental experiences for ${landlord}. Rate the Landlord is a community platform that elevates tenant voices to promote landlord accountability.`
	const siteURL = 'https://ratethelandlord.org'
	const pageURL = pathName === '/' ? siteURL : siteURL + pathName
	const twitterHandle = '@r8thelandlord'
	const siteName = 'RateTheLandlord.org'

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
			<LandlordPage landlord={landlord} data={data} />
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
	params: { landlord: string }
}) {
	const landlordMessages = (await import(
		`@/messages/${locale}/landlord.json`
	)) as Record<string, string>
	const alertsMessages = (await import(
		`@/messages/${locale}/alerts.json`
	)) as Record<string, string>
	const layoutMessages = (await import(
		`@/messages/${locale}/layout.json`
	)) as Record<string, string>
	const filtersMessages = (await import(
		`@/messages/${locale}/filters.json`
	)) as Record<string, string>
	const reviewsMessages = (await import(
		`@/messages/${locale}/reviews.json`
	)) as Record<string, string>

	const data = await getLandlordReviews(params.landlord)

	if (!data || data.reviews.length === 0) {
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
				landlord: params.landlord,
				data: data,
				messages: {
					...alertsMessages,
					...layoutMessages,
					...filtersMessages,
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

export default Landlord
