'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function LandlordNotFound() {
	const t = useTranslations('landlord')

	return (
		<main className='mt-2 grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
			<div className='text-center'>
				<p className='text-base text-indigo-600'>404</p>
				<h1 className='mt-4 text-3xl text-gray-900 sm:text-5xl'>
					{t('not-found.title')}
				</h1>
				<div className='mt-10 flex items-center justify-center gap-x-6'>
					<Link
						href='/'
						className='border-primary bg-primary hover:bg-primary-hover cursor-pointer rounded-md border px-8 py-3 text-base text-white md:px-10 md:py-4 md:text-lg'
					>
						{t('not-found.back-home')}
					</Link>
				</div>
			</div>
		</main>
	)
}
