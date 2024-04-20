import Layout from '@/components/layout/layout'
import { AppProps } from 'next/app'
import '../styles/global.css'
import '../i18n'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { UserProvider } from '@auth0/nextjs-auth0/client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string

if (typeof window !== 'undefined') {
	// checks that we are client-side
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
		loaded: (posthog) => {
			if (process.env.NODE_ENV === 'development') posthog.debug() // debug mode in development
		},
	})
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const { user } = pageProps
	return (
		<PostHogProvider client={posthog}>
			<UserProvider user={user}>
				<Provider store={store}>
					<ReCaptchaProvider reCaptchaKey={CAPTCHA_SITE_KEY} useEnterprise>
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</ReCaptchaProvider>
				</Provider>
			</UserProvider>
		</PostHogProvider>
	)
}

export default MyApp
