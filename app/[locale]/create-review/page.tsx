import type { Metadata } from 'next'
import ReviewForm from '@/components/createReview/ReviewForm'

const title = 'Create Review | Rate The Landlord'
const description =
	'Create a Review for your Landlord. Share information with tenants like you and rate your landlord. We are a community platform that elevates tenant voices to promote landlord accountability.'

export const metadata: Metadata = {
	title: { absolute: title },
	description,
	alternates: { canonical: 'https://ratethelandlord.org/create-review' },
	openGraph: {
		type: 'website',
		url: 'https://ratethelandlord.org/create-review',
		title,
		description,
	},
}

export default function CreateReviewPage() {
	return (
		<main
			className='flex w-full justify-center'
			data-testid='create-review-form-1'
		>
			<div className='flex flex-col'>
				<ReviewForm />
			</div>
		</main>
	)
}
