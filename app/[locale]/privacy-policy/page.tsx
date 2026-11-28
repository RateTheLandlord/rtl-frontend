import type { Metadata } from 'next'
import Privacy from '@/components/privacy/Privacy'
import { createPageMetadata, type SiteLocale } from '@/lib/seo/metadata'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: SiteLocale }>
}): Promise<Metadata> {
	const { locale } = await params
	return createPageMetadata({
		locale,
		path: '/privacy-policy',
		title:
			locale === 'fr-CA'
				? 'Confidentialité | Rate The Landlord'
				: 'Privacy Policy | Rate The Landlord',
		description:
			locale === 'fr-CA'
				? 'Consultez la politique de confidentialité de Rate The Landlord et apprenez comment les renseignements soumis et les avis sont traités.'
				: 'Read how Rate The Landlord handles submitted information, reviews, and privacy requests.',
	})
}

export default function PrivacyPolicyPage() {
	return (
		<main className='flex w-full justify-center'>
			<div className='container mt-5 flex flex-col items-center gap-4 px-2'>
				<Privacy />
			</div>
		</main>
	)
}
