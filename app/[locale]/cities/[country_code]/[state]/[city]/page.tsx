import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import CityPage from '@/components/city/CityPage'
import { getCityReviews } from '@/lib/review/city'
import type { ICityQuery } from '@/lib/review/types/Queries'
import type { ICityReviews } from '@/lib/review/types/Review'
import { toTitleCase } from '@/util/helpers/toTitleCase'

export const revalidate = 100

const getCityData = cache(
	async (country_code: string, state: string, city: string) =>
		getCityReviews({ country_code, state, city }),
)

const getValidCityData = async (params: ICityQuery) => {
	const data = await getCityData(
		params.country_code,
		params.state,
		params.city,
	)
	if (!data?.reviews?.length) notFound()
	return data
}

type PageProps = {
	params: Promise<{ country_code: string; state: string; city: string }>
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { country_code, state, city } = await params
	const data = await getValidCityData({ country_code, state, city })
	const cityName = toTitleCase(city)
	const stateName = toTitleCase(state)
	const countryName = toTitleCase(country_code)
	const title = `${cityName}, ${stateName}, ${countryName} Reviews | Rate The Landlord`
	const description = `Looking to rent in ${cityName}? Read ${data.total} landlord reviews and rental experiences for ${cityName}. Rate the Landlord is a community platform that elevates tenant voices to promote landlord accountability.`
	const url = `https://ratethelandlord.org/cities/${encodeURIComponent(country_code)}/${encodeURIComponent(state)}/${encodeURIComponent(city)}`

	return {
		title: { absolute: title },
		description,
		alternates: { canonical: url },
		openGraph: { type: 'website', url, title, description },
	}
}

export default async function CityReviewsPage({ params }: PageProps) {
	const routeParams = await params
	const data = await getValidCityData(routeParams)
	const serializableData = JSON.parse(JSON.stringify(data)) as ICityReviews

	return (
		<CityPage
			city={routeParams.city}
			state={routeParams.state}
			country={routeParams.country_code}
			data={serializableData}
		/>
	)
}
