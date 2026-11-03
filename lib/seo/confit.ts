const siteUrl = 'https://www.ratethelandlord.org'
const siteName = 'RateTheLandlord'

const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE

const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'

export const seoConfig = {
	titleTemplate: '%s | RateTheLandlord',
	defaultTitle: 'RateTheLandlord',
	description:
		'Read and share landlord reviews. Help renters make informed decisions about where they live.',

	openGraph: {
		type: 'website' as const,
		locale: 'en_CA',
		url: siteUrl,
		siteName,
	},

	...(twitterHandle && {
		twitter: {
			handle: twitterHandle,
			site: twitterHandle,
			cardType: 'summary_large_image' as const,
		},
	}),

	additionalMetaTags: [
		{
			name: 'author',
			content: siteName,
		},
	],

	additionalLinkTags: [
		{
			rel: 'icon',
			href: `${siteUrl}/favicon.ico`,
		},
	],

	// Prevent search engines from indexing non-production environments.
	noindex: !isProduction,
	nofollow: !isProduction,
}
