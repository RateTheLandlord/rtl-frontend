import LandlordPage from '@/components/landlord/LandlordPage'
import Spinner from '@/components/ui/Spinner'
import { getLandlordReviews, getLandlords } from '@/lib/review/review'
import { Review } from '@/util/interfaces/interfaces'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

interface IProps {
	landlord: string
	reviews: Review[]
}

const Landlord = ({ landlord, reviews }: IProps) => {
	const title = `${landlord} Reviews | Rate The Landlord`
	const desc = `Reviews for ${landlord}. Read ${reviews?.length} reviews and rental experiences for ${landlord}. Rate the Landlord is a community platform that elevates tenant voices to promote landlord accountability.`
	const siteURL = 'https://ratethelandlord.org'
	const pathName = useRouter().pathname
	const pageURL = pathName === '/' ? siteURL : siteURL + pathName
	const twitterHandle = '@r8thelandlord'
	const siteName = 'RateTheLandlord.org'

	if (!reviews) return <Spinner />

	if (reviews.length === 0) return <div>Error Loading Landlord</div>

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
			<LandlordPage landlord={landlord} reviews={reviews} />
		</>
	)
}

export async function getStaticPaths() {
	const data = await getLandlords()

	const paths = data.map((landlord) => ({
		params: { landlord: encodeURIComponent(landlord) },
	}))
	return {
		paths: [...paths],
		// Enable statically generating additional pages
		fallback: true,
	}
}

export async function getStaticProps({ params }) {
	const data = await getLandlordReviews(params.landlord)

	// Pass post data to the page via props
	return {
		props: JSON.parse(
			JSON.stringify({ landlord: params.landlord, reviews: data }),
		),
		// Re-generate the page
		// if a request comes in after 100 seconds
		revalidate: 100,
	}
}

export default Landlord
