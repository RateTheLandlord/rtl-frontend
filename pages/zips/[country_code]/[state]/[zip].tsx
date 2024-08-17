import Spinner from '@/components/ui/Spinner'
import ZipPage from '@/components/zip/ZipPage'
import { IZipReviews, getZipReviews } from '@/lib/review/review'
import { toTitleCase } from '@/util/helpers/toTitleCase'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

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

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: 'blocking',
	}
}

export async function getStaticProps({ params }) {
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
			}),
		),
		// Re-generate the page
		// if a request comes in after 100 seconds
		revalidate: 100,
	}
}

export default Zip
