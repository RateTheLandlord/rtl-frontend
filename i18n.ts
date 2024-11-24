import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import layoutENCA from './public/locales/en-CA/layout.json'
import homeENCA from './public/locales/en-CA/home.json'
import createreviewENCA from './public/locales/en-CA/createreview.json'
import reviewsENCA from './public/locales/en-CA/reviews.json'
import aboutENCA from './public/locales/en-CA/about.json'
import landlordENCA from './public/locales/en-CA/landlord.json'
import alertsENCA from './public/locales/en-CA/alerts.json'
import resourcesENCA from './public/locales/en-CA/resources.json'
import supportENCA from './public/locales/en-CA/support.json'
import filtersENCA from './public/locales/en-CA/filters.json'

import layoutFRCA from './public/locales/fr-CA/layout_fr.json'
import homeFRCA from './public/locales/fr-CA/home_fr.json'
import createreviewFRCA from './public/locales/fr-CA/createreview_fr.json'
import reviewsFRCA from './public/locales/fr-CA/reviews_fr.json'
import aboutFRCA from './public/locales/fr-CA/about_fr.json'
import landlordFRCA from './public/locales/fr-CA/landlord_fr.json'
import alertsFRCA from './public/locales/fr-CA/alerts_fr.json'
import resourcesFRCA from './public/locales/fr-CA/resources_fr.json'
import supportFRCA from './public/locales/fr-CA/support_fr.json'
import filtersFRCA from './public/locales/fr-CA/filters_fr.json'

const resources = {
	en: {
		about: aboutENCA,
		alerts: alertsENCA,
		create: createreviewENCA,
		home: homeENCA,
		landlord: landlordENCA,
		layout: layoutENCA,
		resourcesPage: resourcesENCA,
		reviews: reviewsENCA,
		support: supportENCA,
		filters: filtersENCA,
	},
	frca: {
		about: aboutFRCA,
		alerts: alertsFRCA,
		create: createreviewFRCA,
		home: homeFRCA,
		landlord: landlordFRCA,
		layout: layoutFRCA,
		resourcesPage: resourcesFRCA,
		reviews: reviewsFRCA,
		support: supportFRCA,
		filters: filtersFRCA,
	},
}

void i18n
	.use(LanguageDetector)
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources: resources,
		fallbackLng: 'en',
		debug: false,
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	})

export default i18n
