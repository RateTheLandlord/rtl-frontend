import type { Metadata } from 'next'
import AdsComponent, { AD_UNITS } from '@/components/adsense/Adsense'
import Hero from '@/components/home/Hero'
import IconSection from '@/components/home/IconSection'
import Search from '@/components/home/Search'
import JsonLd from '@/components/seo/JsonLd'
import { createPageMetadata, type SiteLocale } from '@/lib/seo/metadata'

const description =
	'Share information with tenants like you and rate your landlord. We are a community platform that elevates tenant voices to promote landlord accountability. Find Landlord Reviews and Resources.'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: SiteLocale }>
}): Promise<Metadata> {
	const { locale } = await params
	return createPageMetadata({
		locale,
		path: '/',
		title: 'Rate The Landlord',
		description:
			locale === 'fr-CA'
				? 'Consultez et partagez des avis sur les propriétaires afin d’aider les locataires à prendre des décisions éclairées sur leur logement.'
				: description,
	})
}

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: SiteLocale }>
}) {
	const { locale } = await params
	const structuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': 'https://ratethelandlord.org/#organization',
				name: 'Rate The Landlord Inc.',
				url: 'https://ratethelandlord.org',
				logo: 'https://ratethelandlord.org/new_logo.svg',
			},
			{
				'@type': 'WebSite',
				'@id': 'https://ratethelandlord.org/#website',
				name: 'Rate The Landlord',
				url: `https://ratethelandlord.org${locale === 'fr-CA' ? '/fr-CA' : ''}`,
				inLanguage: locale,
				publisher: { '@id': 'https://ratethelandlord.org/#organization' },
			},
		],
	}

	return (
		<>
			<JsonLd data={structuredData} />
			<main className='flex w-full flex-col justify-center'>
				<AdsComponent slot={AD_UNITS.HOMEPAGE} />
				<div className='bg-background mx-2 mt-4 rounded-3xl pb-4'>
					<Hero />
					<Search />
				</div>
				<IconSection />
			</main>
		</>
	)
}
