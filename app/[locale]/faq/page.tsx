import type { Metadata } from 'next'
import Faq from '@/components/about/Faq'
import { createPageMetadata, type SiteLocale } from '@/lib/seo/metadata'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: SiteLocale }>
}): Promise<Metadata> {
	const { locale } = await params
	return createPageMetadata({
		locale,
		path: '/faq',
		title:
			locale === 'fr-CA'
				? 'Foire aux questions | Rate The Landlord'
				: 'Frequently Asked Questions | Rate The Landlord',
		description:
			locale === 'fr-CA'
				? 'Trouvez des réponses sur la lecture et la publication d’avis, la confidentialité des locataires et la modération.'
				: 'Get answers about reading and submitting landlord reviews, tenant privacy, and how reviews are moderated.',
	})
}

export default function FrequentlyAskedQuestionsPage() {
	return (
		<main className='flex w-full justify-center'>
			<div className='container mt-5 flex flex-col items-center gap-4 px-2'>
				<Faq />
			</div>
		</main>
	)
}
