import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth0'

export default async function LoginCompletePage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const localePrefix = locale === 'en-CA' ? '' : `/${locale}`
	const session = await auth0.getSession()

	if (!session) {
		const returnTo = `${localePrefix}/login/complete`
		redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`)
	}

	if (session.user.role === 'ADMIN') {
		redirect(`${localePrefix}/admin/${encodeURIComponent(session.user.name ?? '')}`)
	}

	redirect(localePrefix || '/')
}
