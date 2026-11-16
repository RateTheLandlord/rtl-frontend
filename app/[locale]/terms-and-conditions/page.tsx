import type { Metadata } from 'next'
import Terms from '@/components/terms/Terms'

const title = 'Terms and Conditions | Rate The Landlord'
const description =
	'Share information with tenants like you. We are a community platform that elevates tenant voices to promote landlord accountability.'

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: 'https://ratethelandlord.org/terms-and-conditions' },
	openGraph: {
		type: 'website',
		url: 'https://ratethelandlord.org/terms-and-conditions',
		title,
		description,
	},
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
