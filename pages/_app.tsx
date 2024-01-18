import Layout from '@/components/layout/layout'
import { AppProps } from 'next/app'
import '../styles/global.css'
import '../i18n'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { UserProvider } from '@auth0/nextjs-auth0/client'

const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const { user } = pageProps
	return (
		<UserProvider user={user}>
			<Provider store={store}>
				<ReCaptchaProvider reCaptchaKey={CAPTCHA_SITE_KEY} useEnterprise>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</ReCaptchaProvider>
			</Provider>
		</UserProvider>
	)
}

export default MyApp
