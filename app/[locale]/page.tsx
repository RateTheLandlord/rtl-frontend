import type { Metadata } from 'next'
import AdsComponent, { AD_UNITS } from '@/components/adsense/Adsense'
import Hero from '@/components/home/Hero'
import IconSection from '@/components/home/IconSection'
import Search from '@/components/home/Search'

const description =
	'Share information with tenants like you and rate your landlord. We are a community platform that elevates tenant voices to promote landlord accountability. Find Landlord Reviews and Resources.'

export const metadata: Metadata = {
	title: { absolute: 'Rate The Landlord' },
	description,
	alternates: { canonical: 'https://ratethelandlord.org' },
	openGraph: {
		type: 'website',
		url: 'https://ratethelandlord.org',
		title: 'Rate The Landlord',
		description,
	},
}

export default function HomePage() {
	return (
		<main className='flex w-full flex-col justify-center'>
			<AdsComponent slot={AD_UNITS.HOMEPAGE} />
			<div className='bg-background mx-2 mt-4 rounded-3xl pb-4'>
				<Hero />
				<Search />
			</div>
			<IconSection />
		</main>
	)
}
