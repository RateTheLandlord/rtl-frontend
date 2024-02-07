import Support from '@/components/supportus/SupportUs'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import React from 'react'
import { getMemberData, getTierData } from '@/util/helpers/patreon'
import Supporters from '@/components/supportus/Supporters'

export default function SupportUs({ members }): JSX.Element {
	const title = 'Support Us | Rate The Landlord'
	const desc =
		'Share information with tenants like you and rate your landlord. We are a community platform that elevates tenant voices to promote landlord accountability. Find Landlord Reviews and Resources.'
	const siteURL = 'https://ratethelandlord.org'
	const pathName = useRouter().pathname
	const pageURL = pathName === '/' ? siteURL : siteURL + pathName
	const twitterHandle = '@r8thelandlord'
	const siteName = 'RateTheLandlord.org'

	const memberData = getMemberData(members)
	const tierData = getTierData(members)

	return (
		<div>
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
			<Support />
			<Supporters members={memberData} tiers={tierData} />
		</div>
	)
}

//Page is statically generated at build time and then revalidated at a minimum of every day based on when the page is accessed
export async function getStaticProps() {
	const accessToken = process.env.PATREON_ACCESS_TOKEN as string

	const campaignId = await fetch(
		'https://www.patreon.com/api/oauth2/api/current_user/campaigns',
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		},
	)
		.then((res) => {
			return res.json()
		})
		.then((data) => {
			return data.data[0].id
		})
		.catch((err) => console.log('Error: ', err))

	console.log(campaignId)
	const members = await fetch(
		`https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members?include=currently_entitled_tiers&fields%5Bmember%5D=full_name&fields%5Btier%5D=amount_cents,created_at,discord_role_ids,edited_at,patron_count,title,url`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		},
	)
		.then((res) => {
			return res.json()
		})
		.then((data) => {
			return data
		})
		.catch((err) => console.log('Error: ', err))

	return {
		props: {
			members: members,
		},
		revalidate: 86400,
	}
}
