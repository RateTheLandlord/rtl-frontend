/* eslint-disable @typescript-eslint/unbound-method */
import Layout from '@/components/layout/layout'
import ModalProvider from '@/components/modal/ModalProvider'
import { PHProvider } from '@/components/PostHog/PHProvider'
import { store } from '@/redux/store'
import { UserProfile, UserProvider } from '@auth0/nextjs-auth0/client'
import 'mapbox-gl/dist/mapbox-gl.css'
import { NextIntlClientProvider } from 'next-intl'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { generateDefaultSeo } from 'next-seo/pages'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect, type JSX } from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/global.css'
import { seoConfig } from '@/lib/seo/confit'

const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT as string

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)

interface CustomAppProps extends AppProps {
	pageProps: {
		user: UserProfile
		messages: Record<string, string>
	}
}

function MyApp({ Component, pageProps }: CustomAppProps): JSX.Element {
	const { user } = pageProps as { user: UserProfile }
	const router = useRouter()

	const timeZone = 'America/Montreal'

	useEffect(() => {
		const fetchCronStatus = async () => {
			try {
				const response = await fetch('/api/cron')
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const data = await response.json()
				if (ENVIRONMENT !== 'production') {
					console.log('Cron status:', data) // Optionally log the status
				}
			} catch (error) {
				console.error('Failed to fetch cron status:', error)
			}
		}

		fetchCronStatus().catch(() => console.error('Failed to get CRON status')) // Call the function when the app is mounted
	}, [])

	return (
		<NextIntlClientProvider
			locale={router.locale}
			messages={pageProps.messages}
			timeZone={timeZone}
		>
			<Head>{generateDefaultSeo(seoConfig)}</Head>
			<PHProvider>
				<UserProvider user={user}>
					<Provider store={store}>
						<ReCaptchaProvider reCaptchaKey={CAPTCHA_SITE_KEY} useEnterprise>
							<ModalProvider>
								<Layout>
									<>
										<Component {...pageProps} />
										<ToastContainer
											position='bottom-center'
											autoClose={5000}
											limit={3}
											hideProgressBar
											newestOnTop={false}
											closeOnClick
											rtl={false}
											pauseOnFocusLoss={false}
											draggable
											pauseOnHover={false}
											theme='light'
										/>
									</>
								</Layout>
							</ModalProvider>
						</ReCaptchaProvider>
					</Provider>
				</UserProvider>
			</PHProvider>
		</NextIntlClientProvider>
	)
}

export default MyApp
