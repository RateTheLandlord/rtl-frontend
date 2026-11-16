import type { Metadata } from 'next'
import Faq from '@/components/about/Faq'

const title = 'Frequently Asked Questions | Rate The Landlord'
const description =
	'Share information with tenants like you. We are a community platform that elevates tenant voices to promote landlord accountability.'

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: 'https://ratethelandlord.org/faq' },
	openGraph: {
		type: 'website',
		url: 'https://ratethelandlord.org/faq',
		title,
		description,
	},
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
