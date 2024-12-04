// @ts-check
const { i18n } = require('./next-i18next.config.js')

/** @type {import('next').NextConfig} */

const securityHeaders = [
	{
		key: 'X-XSS-Protection',
		value: '1; mode=block',
	},
]
const nextConfig = {
	headers() {
		return [
			{
				// Apply these headers to all routes in your application.
				source: '/:path*',
				headers: securityHeaders,
			},
		]
	},
	i18n,
	reactStrictMode: true,
}



module.exports = nextConfig