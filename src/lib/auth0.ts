import { Auth0Client } from '@auth0/nextjs-auth0/server'

const roleClaim = 'https://ratethelandlord.org/roles'
const adminIdClaim = 'https://ratethelandlord.org/admin_id'

const issuerDomain = process.env.AUTH0_ISSUER_BASE_URL?.replace(
	/^https?:\/\//,
	'',
).replace(/\/+$/, '')

export const auth0 = new Auth0Client({
	appBaseUrl: process.env.APP_BASE_URL ?? process.env.AUTH0_BASE_URL,
	domain: process.env.AUTH0_DOMAIN ?? issuerDomain,
	beforeSessionSaved(session) {
		const role: unknown = session.user[roleClaim]
		const adminId: unknown = session.user[adminIdClaim]
		const user = { ...session.user }

		if (typeof role === 'string') {
			user.role = role
		}
		if (typeof adminId === 'string') {
			user.admin_id = adminId
		}

		return Promise.resolve({ ...session, user })
	},
})
