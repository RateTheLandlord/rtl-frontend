/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Layout from '@/components/layout/layout'
import { AppProps } from 'next/app'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles/global.css'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { UserProfile, UserProvider } from '@auth0/nextjs-auth0/client'
import { PHProvider } from '@/components/PostHog/PHProvider'
import nProgress from 'nprogress'
import { Router, useRouter } from 'next/router'
import 'nprogress/nprogress.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { NextIntlClientProvider } from 'next-intl'

const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string

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

	useEffect(() => {
		const fetchCronStatus = async () => {
			try {
				const response = await fetch('/api/cron')
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const data = await response.json()
				console.log('Cron status:', data) // Optionally log the status
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
		>
			<PHProvider>
				<UserProvider user={user}>
					<Provider store={store}>
						<ReCaptchaProvider reCaptchaKey={CAPTCHA_SITE_KEY} useEnterprise>
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
						</ReCaptchaProvider>
					</Provider>
				</UserProvider>
			</PHProvider>
		</NextIntlClientProvider>
	)
}

export default MyApp
