// @ts-check

import type { NextConfig } from 'next'

const securityHeaders = [
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	},
	{
		key: 'Referrer-Policy',
		value: 'strict-origin-when-cross-origin',
	},
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN',
	},
]

const nextConfig: NextConfig = {
	output: 'standalone',

	outputFileTracingIncludes: {
		'/*': ['./node_modules/bcrypt/prebuilds/linux-x64/bcrypt.glibc.node'],
	},

	headers: async () => [
		{
			source: '/:path*',
			headers: securityHeaders,
		},
	],
	i18n: {
		locales: ['en-CA', 'fr-CA'],
		defaultLocale: 'en-CA',
	},

	reactStrictMode: true,
}

export default nextConfig
