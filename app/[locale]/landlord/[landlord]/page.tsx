import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import LandlordPage from '@/components/landlord/LandlordPage'
import { getLandlordReviews } from '@/lib/review/landlords'
import type { ILandlordReviews } from '@/lib/review/types/Queries'
import { createPageMetadata, type SiteLocale } from '@/lib/seo/metadata'

export const revalidate = 100

const getLandlordData = cache(async (landlord: string) =>
	getLandlordReviews(landlord),
)

const getValidLandlordData = async (landlord: string) => {
	const data = await getLandlordData(landlord)
	if (!data?.reviews?.length) notFound()
	return data
}

type PageProps = {
	params: Promise<{ locale: SiteLocale; landlord: string }>
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { landlord, locale } = await params
	const data = await getValidLandlordData(landlord)
	const title =
		locale === 'fr-CA'
			? `Avis sur ${landlord} | Rate The Landlord`
			: `${landlord} Reviews | Rate The Landlord`
	const description =
		locale === 'fr-CA'
			? `Consultez ${data.total} avis de locataires sur ${landlord} et leurs expériences de location.`
			: `Read ${data.total} tenant reviews and rental experiences for ${landlord}.`

	return createPageMetadata({
		locale,
		path: `/landlord/${encodeURIComponent(landlord)}`,
		title,
		description,
	})
}

export default async function LandlordReviewsPage({ params }: PageProps) {
	const { landlord } = await params
	const data = await getValidLandlordData(landlord)
	const serializableData = JSON.parse(JSON.stringify(data)) as ILandlordReviews

	return <LandlordPage landlord={landlord} data={serializableData} />
}
