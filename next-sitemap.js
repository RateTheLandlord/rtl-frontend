const siteUrl = 'https://ratethelandlord.org/'
module.exports = {
	siteUrl,
	exclude: ['/404'],
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				disallow: ['/404'],
			},
			{ userAgent: '*', allow: '/' },
		],
		additionalSitemaps: [
			`${siteUrl}sitemap.xml`,
			`${siteUrl}server-sitemap.xml`,
		],
	},
}
