import type { Metadata } from 'next'
import Privacy from '@/components/privacy/Privacy'

const title = 'Privacy Policy | Rate The Landlord'
const description =
	'Share information with tenants like you. We are a community platform that elevates tenant voices to promote landlord accountability.'

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: 'https://ratethelandlord.org/privacy-policy' },
	openGraph: {
		type: 'website',
		url: 'https://ratethelandlord.org/privacy-policy',
		title,
		description,
	},
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
