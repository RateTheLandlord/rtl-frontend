import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { cookieConsentGiven } from './CookieBanner'

export function PHProvider({ children }) {
	if (typeof window !== 'undefined') {
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
			api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
			person_profiles: 'always',
			persistence:
				cookieConsentGiven() === 'yes' ? 'localStorage+cookie' : 'memory',
		})
	}
	return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
