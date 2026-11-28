import type { Metadata } from 'next'
import ReviewForm from '@/components/createReview/ReviewForm'
import { createPageMetadata, type SiteLocale } from '@/lib/seo/metadata'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: SiteLocale }>
}): Promise<Metadata> {
	const { locale } = await params
	return createPageMetadata({
		locale,
		path: '/create-review',
		title:
			locale === 'fr-CA'
				? 'Soumettre un avis | Rate The Landlord'
				: 'Submit a Landlord Review | Rate The Landlord',
		description:
			locale === 'fr-CA'
				? 'Partagez anonymement votre expérience de location pour aider les autres locataires.'
				: 'Share your rental experience anonymously to help other tenants make informed decisions.',
		noindex: true,
	})
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
