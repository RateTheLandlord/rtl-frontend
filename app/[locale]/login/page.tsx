import { redirect } from 'next/navigation'
import LoginScreen from '@/components/auth/LoginScreen'
import { auth0 } from '@/lib/auth0'

export default async function LoginPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const localePrefix = locale === 'en-CA' ? '' : `/${locale}`
	const session = await auth0.getSession()
	if (!session) {
		const returnTo = `${localePrefix}/login`
		redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`)
	}

	return <LoginScreen />
}
