import Layout from '@/components/layout/layout'
import { AppProps } from 'next/app'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles/global.css'
import '../i18n'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { PHProvider } from '@/components/PostHog/PHProvider'
import nProgress from 'nprogress'
import { Router } from 'next/router'
import 'nprogress/nprogress.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { appWithTranslation } from 'next-i18next'
import { useEffect } from 'react'

const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const { user } = pageProps

	useEffect(() => {
		const fetchCronStatus = async () => {
			try {
				const response = await fetch('/api/cron')
				const data = await response.json()
				console.log('Cron status:', data) // Optionally log the status
			} catch (error) {
				console.error('Failed to fetch cron status:', error)
			}
		}

		fetchCronStatus() // Call the function when the app is mounted
	}, [])

	return (
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
	)
}

export default appWithTranslation(MyApp)
