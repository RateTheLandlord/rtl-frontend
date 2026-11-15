'use client'

import { useTranslations } from 'next-intl'

export default function ResourcesContribution() {
	const t = useTranslations('resources')

	return (
		<p className='mt-8 text-center text-xl leading-8 text-gray-500'>
			{t('contribute')}
		</p>
	)
}
