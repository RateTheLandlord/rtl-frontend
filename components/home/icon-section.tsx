import React from 'react'
import { useTranslation } from 'react-i18next'
import Privacy from '../svg/icons/privacy'
import Solidarity from '../svg/icons/Solidarity'
import Transparency from '../svg/icons/transparency'

export default function IconSection() {
	const { t } = useTranslation('home')
	return (
		<div className='min-w-full' data-testid='home-icon-section-1'>
			<div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
				<div className='rounded-3xl bg-gray-50 px-6 py-16 sm:p-16'>
					<div className='mx-auto max-w-xl lg:max-w-none'>
						<div className='text-center'>
							<h2 className='text-2xl font-extrabold tracking-tight text-gray-900'>
								{t('home.icon.title')}
							</h2>
						</div>
						<div className='mx-auto mt-12 grid max-w-sm grid-cols-1 gap-x-8 gap-y-10 sm:max-w-none lg:grid-cols-3'>
							<div className='text-center sm:flex sm:text-left lg:block lg:text-center'>
								<div className='flex justify-center sm:flex-shrink-0 '>
									<div className='flow-root'>
										<Privacy styling='className="w-16 h-16 mx-auto text-teal-600' />
									</div>
								</div>
								<div className='mt-3 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6'>
									<h3 className='text-2xl font-extrabold text-gray-900'>
										{t('home.icon.anonymity')}
									</h3>
									<p className='mt-2 text-sm text-gray-900'>
										{t('home.icon.anon-sub')}
									</p>
								</div>
							</div>
							<div className='text-center sm:flex sm:text-left lg:block lg:text-center'>
								<div className='sm:flex-shrink-0'>
									<div className='flow-root'>
										<Solidarity styling='className="w-16 h-16 mx-auto text-teal-600' />
									</div>
								</div>
								<div className='mt-3 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6'>
									<h3 className='text-2xl font-extrabold text-gray-900'>
										{t('home.icon.solidarity')}
									</h3>
									<p className='mt-2 text-sm text-gray-900'>
										{t('home.icon.sol-sub')}
									</p>
								</div>
							</div>
							<div className='text-center sm:flex sm:text-left lg:block lg:text-center'>
								<div className='sm:flex-shrink-0'>
									<div className='flow-root'>
										<Transparency styling='className="w-16 h-16 mx-auto text-teal-600' />
									</div>
								</div>
								<div className='mt-3 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6'>
									<h3 className='text-2xl font-extrabold text-gray-900'>
										{t('home.icon.transparency')}
									</h3>
									<p className='mt-2 text-sm text-gray-900'>
										{t('home.icon.trans-sub')}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
