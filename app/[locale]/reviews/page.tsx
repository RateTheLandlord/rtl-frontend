import type { Metadata } from 'next'
import ReviewForm from '@/components/reviews/ReadReviews'

const title = 'Reviews | Rate The Landlord'
const description =
	'View and Search for Landlord Reviews and learn about others Rental Experience. We are a community platform that elevates tenant voices to promote landlord accountability.'

export const metadata: Metadata = {
	title: { absolute: title },
	description,
	alternates: { canonical: 'https://ratethelandlord.org/reviews' },
	openGraph: {
		type: 'website',
		url: 'https://ratethelandlord.org/reviews',
		title,
		description,
	},
}

type SearchParams = {
	[key: string]: string | string[] | undefined
}

export default async function ReviewsPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>
}) {
	return <ReviewForm routeParams={await searchParams} />
}
