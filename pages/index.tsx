import AdsComponent from '@/components/adsense/Adsense'
import Search from '@/components/home/Search'
import Hero from '@/components/home/hero'
import IconSection from '@/components/home/icon-section'
import SEO from '@/components/seo/SEO'
import { useRouter } from 'next/router'
import { type JSX } from 'react'

export default function Home(): JSX.Element {
	const title = 'Rate The Landlord'
	const desc =
		'Share information with tenants like you and rate your landlord. We are a community platform that elevates tenant voices to promote landlord accountability. Find Landlord Reviews and Resources.'
	const siteURL = 'https://ratethelandlord.org'
	const pathName = useRouter().pathname
	const pageURL = pathName === '/' ? siteURL : siteURL + pathName

	return (
		<div className='flex flex-col justify-center'>
			<SEO
				title={title}
				description={desc}
				canonical={pageURL}
				openGraph={{
					type: 'website',
					url: pageURL,
					title,
					description: desc,
				}}
			/>{' '}
			<AdsComponent slot='2964662882' />
			<div className='bg-background mx-2 mt-4 rounded-3xl pb-4'>
				<Hero />
				<Search />
			</div>
			<IconSection />
		</div>
	)
}

export async function getStaticProps({ locale }: { locale: string }) {
	const homeMessages = (await import(
		`@/messages/${locale}/home.json`
	)) as Record<string, string>
	const alertsMessages = (await import(
		`@/messages/${locale}/alerts.json`
	)) as Record<string, string>
	const layoutMessages = (await import(
		`@/messages/${locale}/layout.json`
	)) as Record<string, string>
	const filtersMessages = (await import(
		`@/messages/${locale}/filters.json`
	)) as Record<string, string>

	return {
		props: {
			messages: {
				...homeMessages,
				...alertsMessages,
				...layoutMessages,
				...filtersMessages,
			},
		},
	}
}
