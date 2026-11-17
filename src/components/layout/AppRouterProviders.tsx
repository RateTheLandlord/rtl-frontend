'use client'

import { UserProvider } from '@auth0/nextjs-auth0/client'
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { store } from '@/redux/store'
import { PHProvider } from '@/components/postHog/PHProvider'
import Banner from '@/components/postHog/CookieBanner'
import AppRouterFooter from '@/components/layout/AppRouterFooter'
import AppRouterNavbar from '@/components/layout/AppRouterNavbar'
import ModalProvider from '@/components/modal/ModalProvider'
import type { ReactNode } from 'react'
import 'react-toastify/dist/ReactToastify.css'

type Props = {
	children: ReactNode
	locale: string
	messages: AbstractIntlMessages
}

const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string

export default function AppRouterProviders({
	children,
	locale,
	messages,
}: Props) {
	return (
		<NextIntlClientProvider
			locale={locale}
			messages={messages}
			timeZone='America/Montreal'
		>
			<PHProvider>
				<UserProvider>
					<Provider store={store}>
						<ReCaptchaProvider reCaptchaKey={CAPTCHA_SITE_KEY} useEnterprise>
							<ModalProvider>
								<AppRouterNavbar />
								<div className='font-inclusive flex min-h-screen justify-center'>
									{children}
								</div>
								<Banner
									privacyHref={
										locale === 'en-CA'
											? '/privacy-policy'
											: `/${locale}/privacy-policy`
									}
								/>
								<AppRouterFooter />
								<ToastContainer
									position='bottom-center'
									autoClose={5000}
									limit={3}
									hideProgressBar
									closeOnClick
									pauseOnFocusLoss={false}
									draggable
									pauseOnHover={false}
									theme='light'
								/>
							</ModalProvider>
						</ReCaptchaProvider>
					</Provider>
				</UserProvider>
			</PHProvider>
		</NextIntlClientProvider>
	)
}
