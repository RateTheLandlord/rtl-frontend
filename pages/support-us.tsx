import Support from '@/components/supportus/SupportUs'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import React from 'react'

export default function SupportUs(): JSX.Element {
	const title = 'Support Us | Rate The Landlord'
	const desc =
		'Share information with tenants like you and rate your landlord. We are a community platform that elevates tenant voices to promote landlord accountability. Find Landlord Reviews and Resources.'
	const siteURL = 'https://ratethelandlord.org'
	const pathName = useRouter().pathname
	const pageURL = pathName === '/' ? siteURL : siteURL + pathName
	const twitterHandle = '@r8thelandlord'
	const siteName = 'RateTheLandlord.org'

	return (
		<div>
			<NextSeo
				title={title}
				description={desc}
				canonical={pageURL}
				openGraph={{
					type: 'website',
					locale: 'en_CA',
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
			<Support />
		</div>
	)
}

//Page is statically generated at build time and then revalidated at a minimum of every day based on when the page is accessed
export async function getStaticProps({ locale }: { locale: string }) {
	const supportMessages = (await import(
		`@/messages/${locale}/support.json`
	)) as Record<string, string>
	const alertsMessages = (await import(
		`@/messages/${locale}/alerts.json`
	)) as Record<string, string>
	const layoutMessages = (await import(
		`@/messages/${locale}/layout.json`
	)) as Record<string, string>

	return {
		props: {
			messages: {
				...supportMessages,
				...alertsMessages,
				...layoutMessages,
			},
		},
		revalidate: 86400,
	}
}
