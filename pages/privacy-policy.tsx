import Privacy from '@/components/privacy/Privacy'
import SEO from '@/components/seo/SEO'
import { useRouter } from 'next/router'
import { type JSX } from 'react'

function TermsAndConditions(): JSX.Element {
	const title = 'Terms and Conditions | Rate The Landlord'
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
			/>{' '}
			<div className='container mt-5 flex flex-col items-center gap-4 px-2'>
				<Privacy />
			</div>
		</div>
	)
}

export default TermsAndConditions

export async function getStaticProps({ locale }: { locale: string }) {
	const alertsMessages = (await import(
		`@/messages/${locale}/alerts.json`
	)) as Record<string, string>
	const layoutMessages = (await import(
		`@/messages/${locale}/layout.json`
	)) as Record<string, string>

	return {
		props: {
			messages: {
				...alertsMessages,
				...layoutMessages,
			},
		},
	}
}
