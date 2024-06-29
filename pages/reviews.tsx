import Review, { ReviewsResponse } from '@/components/reviews/review'
import { NextSeo } from 'next-seo'
import React from 'react'
import { useRouter } from 'next/router'
import { getReviews } from '@/lib/review/review'

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
			<Review data={data} />
		</>
	)
}

//Page is statically generated at build time and then revalidated at a minimum of every 100 seconds based on when the page is accessed
export async function getStaticProps() {
	const data = await getReviews({})

	if (data) {
		return {
			props: JSON.parse(JSON.stringify({ data: data })),
			revalidate: 100,
		}
	} else {
		return {
			props: {
				data: [],
			},
			revalidate: 100,
		}
	}
}
