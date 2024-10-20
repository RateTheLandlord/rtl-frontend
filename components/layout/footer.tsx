import React from 'react'
import { useTranslation } from 'react-i18next'
import { socialLinks } from './links'
import Github from '../svg/social/github'
import Link from 'next/link'

function Footer(): JSX.Element {
	const date = new Date()
	const year = date.getFullYear()
	const { t } = useTranslation('layout')
	return (
		<footer className='bg-white' data-testid='footer-1'>
			<div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 md:flex md:items-center md:justify-between lg:px-8'>
				<div className='flex justify-center space-x-6 md:order-2'>
					<Link href='/terms-and-conditions'>Terms and Conditions</Link>
					<Link href='/privacy-policy'>Privacy Policy</Link>
					<div className='flex flex-wrap gap-2'>
						{socialLinks.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className='flex items-center text-gray-400 hover:text-gray-500'
							>
								<span className='sr-only'>{item.name}</span>
								{item.icon}
							</a>
						))}
						<a
							href='https://github.com/RateTheLandlord'
							className='text-gray-400 hover:text-gray-500'
						>
							<span className='sr-only'>Github</span>
							<Github />
						</a>
					</div>
				</div>
				<div className='mt-8 md:order-1 md:mt-0'>
					<p className='text-center text-base text-gray-400'>
						&copy; {year} {t('layout.footer.copy')}
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
