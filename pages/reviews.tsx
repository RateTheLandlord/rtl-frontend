import { NextSeo } from 'next-seo'
import React from 'react'
import { useRouter } from 'next/router'
import ReviewForm from '@/components/reviews/read-reviews'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function Reviews(): JSX.Element {
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
			<ReviewForm />
		</>
	)
}

export function getStaticProps({ locale }) {
	return {
		props: {
			messages: {
				...require(`../messages/${locale}/reviews.json`),
				...require(`../messages/${locale}/filters.json`),
				...require(`../messages/${locale}/landlord.json`),
				...require(`../messages/${locale}/layout.json`),
			},
		},
	}
}
