import Review, { ReviewsResponse } from '@/components/reviews/review'
import { NextSeo } from 'next-seo'
import React from 'react'
import { useRouter } from 'next/router'

interface IProps {
	data: ReviewsResponse
}

export default function Reviews({ data }: IProps): JSX.Element {
	const title = 'Reviews | Rate The Landlord'
	const desc =
		'View and Search for Landlord Reviews and learn about others Rental Experience. We are a community platform that elevates tenant voices to promote landlord accountability.'
	const siteURL = 'https://ratethelandlord.org'
	const pathName = useRouter().pathname
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
					locale: 'en_CA', //  Default is en_US
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
			{data.reviews && <Review data={data} />}
		</>
	)
}

//Page is statically generated at build time and then revalidated at a minimum of every 100 seconds based on when the page is accessed
export async function getStaticProps() {
	const API_STRING = `${process.env.NEXT_PUBLIC_ORIGIN_URL}/api/review/get-reviews`

	try {
		const req = await fetch(API_STRING)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const data: ReviewsResponse = await req.json()

		return {
			props: {
				data: data,
			},
			revalidate: 100,
		}
	} catch (error) {
		return {
			props: {
				data: [],
			},
			revalidate: 100,
		}
	}
}
