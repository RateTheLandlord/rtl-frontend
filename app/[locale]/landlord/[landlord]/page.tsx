import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import LandlordPage from '@/components/landlord/LandlordPage'
import { getLandlordReviews } from '@/lib/review/landlords'
import type { ILandlordReviews } from '@/lib/review/types/Queries'

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
	params: Promise<{ landlord: string }>
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { landlord } = await params
	const data = await getValidLandlordData(landlord)
	const title = `${landlord} Reviews | Rate The Landlord`
	const description = `Reviews for ${landlord}. Read ${data.total} reviews and rental experiences for ${landlord}. Rate the Landlord is a community platform that elevates tenant voices to promote landlord accountability.`
	const url = `https://ratethelandlord.org/landlord/${encodeURIComponent(landlord)}`

	return {
		title: { absolute: title },
		description,
		alternates: { canonical: url },
		openGraph: { type: 'website', url, title, description },
	}
}

export default async function LandlordReviewsPage({ params }: PageProps) {
	const { landlord } = await params
	const data = await getValidLandlordData(landlord)
	const serializableData = JSON.parse(JSON.stringify(data)) as ILandlordReviews

	return <LandlordPage landlord={landlord} data={serializableData} />
}
