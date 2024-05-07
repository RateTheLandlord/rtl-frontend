import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { cookieConsentGiven } from './CookieBanner'

export function PHProvider({ children }) {
	if (typeof window !== 'undefined') {
		posthog.init('phc_b2Mroy8yak3Wv6ZsUkaSj1SgR4VFNySx2aX1HLD3dGY', {
			api_host: '"https://us.i.posthog.com"',
			persistence:
				cookieConsentGiven() === 'yes' ? 'localStorage+cookie' : 'memory',
		})
	}
	return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
