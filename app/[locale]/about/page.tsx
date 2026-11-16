import type { Metadata } from 'next'
import AboutUs from '@/components/about/AboutUs'
import Contact from '@/components/about/Contact'
import Contributing from '@/components/about/Contributing'
import Moderation from '@/components/about/Moderation'
import Privacy from '@/components/about/Privacy'
import Revenue from '@/components/about/Revenue'
import Poster from '@/components/poster/Poster'

const title = 'About | Rate The Landlord'
const description =
	'Share information with tenants like you. We are a community platform that elevates tenant voices to promote landlord accountability.'

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: 'https://ratethelandlord.org/about' },
	openGraph: {
		type: 'website',
		url: 'https://ratethelandlord.org/about',
		title,
		description,
	},
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
