import type { Auth0ProviderProps } from '@auth0/nextjs-auth0/client'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { auth0 } from '@/lib/auth0'

export default async function AdminPage({
	params,
}: {
	params: Promise<{ locale: string; admin: string }>
}) {
	const { locale, admin } = await params
	const localePrefix = locale === 'en-CA' ? '' : `/${locale}`
	const returnTo = `${localePrefix}/admin/${encodeURIComponent(admin)}`
	const session = await auth0.getSession()
	if (!session) {
		redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`)
	}

	return (
		<AdminDashboard
			initialUser={session.user as Auth0ProviderProps['user']}
		/>
	)
}
