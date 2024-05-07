// app/banner.js
'use client'
import { useEffect, useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import Link from 'next/link'

export function cookieConsentGiven() {
	if (!localStorage.getItem('cookie_consent')) {
		return 'undecided'
	}
	return localStorage.getItem('cookie_consent')
}

export default function Banner() {
	const [consentGiven, setConsentGiven] = useState<string | null>('')
	const posthog = usePostHog()

	useEffect(() => {
		// We want this to only run once the client loads
		// or else it causes a hydration error
		setConsentGiven(cookieConsentGiven())
	}, [])

	useEffect(() => {
		if (consentGiven !== '') {
			posthog.set_config({
				persistence: consentGiven === 'yes' ? 'localStorage+cookie' : 'memory',
			})
		}
	}, [consentGiven])

	const handleAcceptCookies = () => {
		localStorage.setItem('cookie_consent', 'yes')
		setConsentGiven('yes')
	}

	const handleDeclineCookies = () => {
		localStorage.setItem('cookie_consent', 'no')
		setConsentGiven('no')
	}

	return (
		<div>
			{consentGiven === 'undecided' && (
				<div className='pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6'>
					<div className='pointer-events-auto ml-auto max-w-xl rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/10'>
						<p className='text-sm leading-6 text-gray-900'>
							🍪 We use cookies to enhance your browsing experience and analyze
							site traffic. By clicking "Accept", you consent to the use of
							cookies as outlined in our Privacy Policy. We do not sell or
							otherwise transfer your data to third parties. If you prefer to
							decline, only essential cookies will be used. See our{' '}
							<Link
								href='/privacy-policy'
								className='font-semibold text-indigo-600'
							>
								privacy policy
							</Link>
							. 🍪
						</p>
						<div className='mt-4 flex items-center gap-x-5'>
							<button
								className='rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900'
								type='button'
								onClick={handleAcceptCookies}
							>
								Accept
							</button>
							<span> </span>
							<button
								className='text-sm font-semibold leading-6 text-gray-900'
								type='button'
								onClick={handleDeclineCookies}
							>
								Decline
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
