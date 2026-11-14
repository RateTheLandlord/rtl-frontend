// app/banner.js
'use client'
import { useEffect, useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function cookieConsentGiven() {
	if (!localStorage.getItem('cookie_consent')) {
		return 'undecided'
	}
	return localStorage.getItem('cookie_consent')
}

export default function Banner() {
	const t = useTranslations('cookie')
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
	}, [consentGiven, posthog])

	const handleAcceptCookies = () => {
		posthog.capture('cookies_accepted')
		localStorage.setItem('cookie_consent', 'yes')
		setConsentGiven('yes')
	}

	const handleDeclineCookies = () => {
		posthog.capture('cookies_declined')
		localStorage.setItem('cookie_consent', 'no')
		setConsentGiven('no')
	}

	return (
		<div>
			{consentGiven === 'undecided' && (
				<div className='font-inclusive pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6'>
					<div className='pointer-events-auto ml-auto max-w-xl rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/10'>
						<p className='text-sm leading-6 text-gray-900'>
							{t('body-1')}
							<Link
								href='/privacy-policy'
								className='font-semibold text-indigo-600'
							>
								{t('privacy')}
							</Link>
							{t('body-2')}
						</p>
						<div className='mt-4 flex items-center gap-x-5'>
							<button
								className='font-inclusive rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900'
								type='button'
								onClick={handleAcceptCookies}
							>
								{t('accept')}
							</button>
							<span> </span>
							<button
								className='font-inclusive text-sm leading-6 font-medium text-gray-900'
								type='button'
								onClick={handleDeclineCookies}
							>
								{t('decline')}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
