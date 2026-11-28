import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import ZipPage from '@/components/zip/ZipPage'
import { getZipReviews } from '@/lib/review/zip'
import type { IZipReviews } from '@/lib/review/types/Review'
import { toTitleCase } from '@/util/helpers/toTitleCase'
import { createPageMetadata, type SiteLocale } from '@/lib/seo/metadata'

export const revalidate = 100

const getZipData = cache(
	async (country_code: string, state: string, zip: string) =>
		getZipReviews({ country_code, state, zip }),
)

const getValidZipData = async (
	country_code: string,
	state: string,
	zip: string,
) => {
	const data = await getZipData(country_code, state, zip)
	if (!data?.reviews?.length) notFound()
	return data
}

type PageProps = {
	params: Promise<{
		locale: SiteLocale
		country_code: string
		state: string
		zip: string
	}>
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { country_code, state, zip, locale } = await params
	const data = await getValidZipData(country_code, state, zip)
	const zipName = zip.toLocaleUpperCase()
	const stateName = toTitleCase(state)
	const countryName = toTitleCase(country_code)
	const title =
		locale === 'fr-CA'
			? `Avis de propriétaires à ${zipName} | Rate The Landlord`
			: `${zipName}, ${stateName}, ${countryName} Landlord Reviews | Rate The Landlord`
	const description =
		locale === 'fr-CA'
			? `Consultez ${data.total} avis de locataires sur les propriétaires dans la région ${zipName}, ${stateName}.`
			: `Read ${data.total} tenant reviews of landlords in ${zipName}, ${stateName}, ${countryName}.`

	return createPageMetadata({
		locale,
		path: `/zips/${encodeURIComponent(country_code)}/${encodeURIComponent(state)}/${encodeURIComponent(zip)}`,
		title,
		description,
	})
}

export default async function ZipReviewsPage({ params }: PageProps) {
	const { country_code, state, zip } = await params
	const data = await getValidZipData(country_code, state, zip)
	const serializableData = JSON.parse(JSON.stringify(data)) as IZipReviews

	return (
		<ZipPage
			city=''
			state={state}
			country={country_code}
			zip={zip}
			data={serializableData}
		/>
	)
}
