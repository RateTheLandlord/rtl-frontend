import AboutUs from '@/components/about/aboutUs'
import Contact from '@/components/about/contact'
import Contributing from '@/components/about/contributing'
import Moderation from '@/components/about/moderation'
import Privacy from '@/components/about/privacy'
import Revenue from '@/components/about/revenue'
import Poster from '@/components/poster/Poster'
import SEO from '@/components/seo/SEO'
import { useRouter } from 'next/router'
import { type JSX } from 'react'

function About(): JSX.Element {
	const title = 'About | Rate The Landlord'
	const desc =
		'Share information with tenants like you. We are a community platform that elevates tenant voices to promote landlord accountability.'

	const siteURL = 'https://ratethelandlord.org'
	const pathName = useRouter().pathname
	const pageURL = pathName === '/' ? siteURL : siteURL + pathName
	return (
		<div className='flex w-full justify-center'>
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
			/>
			<div className='container mt-5 flex flex-col items-center gap-4 px-2'>
				<AboutUs />
				<Poster />
				<Privacy />
				<Moderation />
				<Revenue />
				<Contributing />
				<Contact />
			</div>
		</div>
	)
}

export default About

export async function getStaticProps({ locale }: { locale: string }) {
	const aboutMessages = (await import(
		`@/messages/${locale}/about.json`
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
				...aboutMessages,
				...alertsMessages,
				...layoutMessages,
				...filtersMessages,
			},
		},
	}
}
