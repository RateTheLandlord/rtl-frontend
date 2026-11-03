import ReviewForm from '@/components/create-review/review-form'
import SEO from '@/components/seo/SEO'
import { useRouter } from 'next/router'
import { type JSX } from 'react'

function CreateReview(): JSX.Element {
	const title = 'Create Review | Rate The Landlord'
	const desc =
		'Create a Review for your Landlord. Share information with tenants like you and rate your landlord. We are a community platform that elevates tenant voices to promote landlord accountability.'
	const siteURL = 'https://ratethelandlord.org'
	const pathName = useRouter().pathname
	const pageURL = pathName === '/' ? siteURL : siteURL + pathName
	return (
		<div
			className='flex w-full justify-center'
			data-testid='create-review-form-1'
		>
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
			<div className='flex flex-col'>
				<ReviewForm />
			</div>
		</div>
	)
}

export default CreateReview

export async function getStaticProps({ locale }: { locale: string }) {
	const createreviewMessages = (await import(
		`@/messages/${locale}/createreview.json`
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
	const reviewMessages = (await import(
		`@/messages/${locale}/reviews.json`
	)) as Record<string, string>
	return {
		props: {
			messages: {
				...createreviewMessages,
				...alertsMessages,
				...layoutMessages,
				...filtersMessages,
				...reviewMessages,
			},
		},
	}
}
