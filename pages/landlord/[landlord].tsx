/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import LandlordPage from '@/components/landlord/LandlordPage'
import SEO from '@/components/seo/SEO'
import Spinner from '@/components/ui/Spinner'
import { getLandlordReviews } from '@/lib/review/landlords'
import { ILandlordReviews } from '@/lib/review/types/Queries'
import { readLocaleFile } from '@/util/readLocalFile'
import { useRouter } from 'next/router'

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

	return (
		<>
			<SEO
				title={title}
				description={desc}
				canonical={pageURL}
				openGraph={{
					type: 'website',
					url: pageURL,
					title,
					description: desc,
				}}
			/>{' '}
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
	const landlordMessages = readLocaleFile('landlord', locale)
	const alertsMessages = readLocaleFile('alerts', locale)
	const layoutMessages = readLocaleFile('layout', locale)
	const filtersMessages = readLocaleFile('filters', locale)
	const reviewsMessages = readLocaleFile('reviews', locale)

	const data = await getLandlordReviews(params.landlord)

	if (!data || (data.reviews && data.reviews.length === 0)) {
		return {
			redirect: {
				permanent: false,
				destination: '/404',
			},
		}
	}

	return {
		props: {
			landlord: params.landlord,
			// Strip undefined properties cleanly without JSON.stringify overhead if possible,
			// or keep it if your database returns complex Date objects.
			data: JSON.parse(JSON.stringify(data)),
			messages: {
				...alertsMessages,
				...layoutMessages,
				...filtersMessages,
				...landlordMessages,
				...reviewsMessages,
			},
		},
		revalidate: 100,
	}
}

export default Landlord
