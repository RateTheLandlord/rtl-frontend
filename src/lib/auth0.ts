import { Auth0Client } from '@auth0/nextjs-auth0/server'

const roleClaimKeys = ['https://ratethelandlord.org/roles']

const issuerDomain = process.env.AUTH0_ISSUER_BASE_URL?.replace(
	/^https?:\/\//,
).replace(/\/+$/, '')

export const auth0 = new Auth0Client({
	appBaseUrl: process.env.APP_BASE_URL ?? process.env.AUTH0_BASE_URL,
	domain: process.env.AUTH0_DOMAIN ?? issuerDomain,
	beforeSessionSaved(session) {
		const isAdmin = roleClaimKeys.some(
			(claim) => session.user[claim] === 'ADMIN',
		)

		return isAdmin
			? { ...session, user: { ...session.user, role: 'ADMIN' } }
			: session
	},
})
