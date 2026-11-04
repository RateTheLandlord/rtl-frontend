import ReviewForm from '@/components/reviews/read-reviews'
import SEO from '@/components/seo/SEO'
import { useRouter } from 'next/router'
import { type JSX } from 'react'

export default function Reviews(): JSX.Element {
	const title = 'Reviews | Rate The Landlord'
	const desc =
		'View and Search for Landlord Reviews and learn about others Rental Experience. We are a community platform that elevates tenant voices to promote landlord accountability.'
	const siteURL = 'https://ratethelandlord.org'
	const pathName = useRouter().pathname
	const pageURL = pathName === '/' ? siteURL : siteURL + pathName
	return (
		<>
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
			<ReviewForm />
		</>
	)
}

export async function getStaticProps({ locale }: { locale: string }) {
	const landlordMessages = (await import(
		`@/messages/${locale}/landlord.json`
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
	const reviewsMessages = (await import(
		`@/messages/${locale}/reviews.json`
	)) as Record<string, string>
	return {
		props: {
			messages: {
				...landlordMessages,
				...alertsMessages,
				...layoutMessages,
				...filtersMessages,
				...reviewsMessages,
			},
		},
	}
}
