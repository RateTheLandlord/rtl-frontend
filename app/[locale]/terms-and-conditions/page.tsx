import type { Metadata } from 'next'
import Terms from '@/components/terms/Terms'
import { createPageMetadata, type SiteLocale } from '@/lib/seo/metadata'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: SiteLocale }>
}): Promise<Metadata> {
	const { locale } = await params
	return createPageMetadata({
		locale,
		path: '/terms-and-conditions',
		title:
			locale === 'fr-CA'
				? 'Conditions d’utilisation | Rate The Landlord'
				: 'Terms and Conditions | Rate The Landlord',
		description:
			locale === 'fr-CA'
				? 'Consultez les conditions qui encadrent l’utilisation de Rate The Landlord, la publication d’avis et les contributions des utilisateurs.'
				: 'Review the terms for using Rate The Landlord, submitting reviews, and contributing to the platform.',
	})
}

export default function TermsAndConditionsPage() {
	return (
		<main className='flex w-full justify-center'>
			<div className='container mt-5 flex flex-col items-center gap-4 px-2'>
				<Terms />
			</div>
		</main>
	)
}
