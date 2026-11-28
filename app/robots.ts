import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/metadata'

export default function robots(): MetadataRoute.Robots {
	const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'

	return {
		rules: isProduction
			? [
					{ userAgent: '*', allow: '/' },
					{ userAgent: 'OAI-SearchBot', allow: '/' },
				]
			: { userAgent: '*', disallow: '/' },
		sitemap: `${SITE_URL}/sitemap.xml`,
	}
}
