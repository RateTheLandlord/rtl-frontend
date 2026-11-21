import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { UserProfile } from '@auth0/nextjs-auth0/client'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage({
	params,
}: {
	params: Promise<{ locale: string; admin: string }>
}) {
	const { locale, admin } = await params
	const localePrefix = locale === 'en-CA' ? '' : `/${locale}`
	const returnTo = `${localePrefix}/admin/${encodeURIComponent(admin)}`
	const session = await getSession()
	const protectedPage = withPageAuthRequired(
		async () => (
			<AdminDashboard initialUser={session?.user as UserProfile | undefined} />
		),
		{ returnTo },
	)

	return protectedPage({})
}
