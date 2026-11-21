import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import LoginScreen from '@/components/auth/LoginScreen'

export default async function LoginPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const localePrefix = locale === 'en-CA' ? '' : `/${locale}`
	const protectedPage = withPageAuthRequired(async () => <LoginScreen />, {
		returnTo: `${localePrefix}/login`,
	})

	return protectedPage({})
}
