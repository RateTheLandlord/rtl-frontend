import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
	locales: ['en-CA', 'fr-CA'],
	defaultLocale: 'en-CA',
	localePrefix: 'as-needed',
})
