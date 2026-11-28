import type { Metadata } from 'next'
import ReviewForm from '@/components/reviews/ReadReviews'
import { createPageMetadata, type SiteLocale } from '@/lib/seo/metadata'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: SiteLocale }>
}): Promise<Metadata> {
	const { locale } = await params
	return createPageMetadata({
		locale,
		path: '/reviews',
		title:
			locale === 'fr-CA'
				? 'Avis sur les propriétaires | Rate The Landlord'
				: 'Landlord Reviews | Rate The Landlord',
		description:
			locale === 'fr-CA'
				? 'Recherchez des avis de locataires sur les propriétaires par pays, province et ville.'
				: 'Search tenant reviews of landlords by country, state or province, and city.',
	})
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
