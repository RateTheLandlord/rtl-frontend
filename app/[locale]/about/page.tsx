import type { Metadata } from 'next'
import AboutUs from '@/components/about/AboutUs'
import Contact from '@/components/about/Contact'
import Contributing from '@/components/about/Contributing'
import Moderation from '@/components/about/Moderation'
import Privacy from '@/components/about/Privacy'
import Revenue from '@/components/about/Revenue'
import Poster from '@/components/poster/Poster'
import { createPageMetadata, type SiteLocale } from '@/lib/seo/metadata'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: SiteLocale }>
}): Promise<Metadata> {
	const { locale } = await params
	return createPageMetadata({
		locale,
		path: '/about',
		title:
			locale === 'fr-CA'
				? 'À propos | Rate The Landlord'
				: 'About | Rate The Landlord',
		description:
			locale === 'fr-CA'
				? 'Découvrez la mission, les pratiques de modération, la confidentialité et le financement de Rate The Landlord.'
				: 'Learn about Rate The Landlord’s mission, moderation practices, privacy commitments, and funding.',
	})
}

export default function AboutPage() {
	return (
		<main className='flex w-full justify-center'>
			<div className='container mt-5 flex flex-col items-center gap-4 px-2'>
				<AboutUs />
				<Poster />
				<Privacy />
				<Moderation />
				<Revenue />
				<Contributing />
				<Contact />
			</div>
		</main>
	)
}
