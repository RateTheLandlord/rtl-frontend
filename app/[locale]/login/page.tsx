import { redirect } from 'next/navigation'

export default async function LoginPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const localePrefix = locale === 'en-CA' ? '' : `/${locale}`
	const returnTo = `${localePrefix}/login/complete`
	redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`)
}
