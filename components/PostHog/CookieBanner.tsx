// app/banner.js
'use client'
import { useEffect, useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

export function cookieConsentGiven() {
	if (!localStorage.getItem('cookie_consent')) {
		return 'undecided'
	}
	return localStorage.getItem('cookie_consent')
}

export default function Banner() {
	const { t } = useTranslation('alerts')
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
							{t('cookie.body-1')}
							<Link
								href='/privacy-policy'
								className='font-semibold text-indigo-600'
							>
								{t('cookie.privacy')}
							</Link>
							{t('cookie.body-2')}
						</p>
						<div className='mt-4 flex items-center gap-x-5'>
							<button
								className='rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900'
								type='button'
								onClick={handleAcceptCookies}
							>
								{t('cookie.accept')}
							</button>
							<span> </span>
							<button
								className='text-sm font-semibold leading-6 text-gray-900'
								type='button'
								onClick={handleDeclineCookies}
							>
								{t('cookie.decline')}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
