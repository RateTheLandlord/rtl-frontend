'use client'

import { Disclosure, DisclosureButton } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import Logo from '@/components/svg/logo/Logo'
import { navigation } from '@/components/layout/Links'
import AppRouterChangeLanguage from '@/components/ui/AppRouterChangeLanguage'
import AppRouterMobileNav from '@/components/layout/AppRouterMobileNav'

export default function AppRouterNavbar() {
	const locale = useLocale()
	const pathname = usePathname() ?? '/'
	const activePath = pathname.includes('resources') ? '/resources' : pathname
	const t = useTranslations('layout')
	const { user } = useUser()

	return (
		<Disclosure as='nav' className='font-inclusive bg-white shadow'>
			{({ open }) => (
				<>
					<div
						className='mx-auto max-w-7xl px-2 sm:px-4 lg:px-8'
						data-testid='navbar-1'
					>
						<div className='flex h-16 justify-between'>
							<div className='flex px-2 lg:px-0'>
								<div className='flex flex-shrink-0 items-center gap-4'>
									<Logo styling='h-8 w-auto' />
									<Link href='/'>{t('nav.title')}</Link>
								</div>
								<div className='hidden lg:ml-6 lg:flex lg:space-x-8'>
									{navigation.map((item) => (
										<div
											className={`${
												activePath === item.href
													? 'border-primary border-b-2'
													: ''
											} inline-flex items-center px-1 pt-1 text-sm text-gray-900`}
											key={item.href}
										>
											<Link href={item.href}>{t(item.name)}</Link>
										</div>
									))}
									{user?.role === 'ADMIN' && (
										<div
											className={`${
												activePath === '/admin'
													? 'border-primary border-b-2'
													: ''
											} inline-flex items-center px-1 pt-1 text-sm text-gray-900`}
										>
											<Link href={`/admin/${user.nickname || 0}`}>Admin</Link>
										</div>
									)}
								</div>
							</div>
							<div className='flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end'>
								<div className='justify-center space-x-6 lg:flex'>
									<AppRouterChangeLanguage locale={locale} />
								</div>
								<div className='hidden lg:ml-6 lg:flex lg:space-x-8'>
									<div className='bg-primary hover:bg-primary-hover focus:ring-primary inline-flex cursor-pointer items-center rounded-md border border-transparent text-sm text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'>
										<Link href='/create-review'>
											<p className='px-4 py-2'>{t('nav.submit')}</p>
										</Link>
									</div>
								</div>
								<div className='hidden lg:ml-6 lg:flex lg:space-x-8'>
									{user?.role === 'ADMIN' && (
										<Link
											className='inline-flex cursor-pointer items-center rounded-md border border-transparent bg-blue-600 text-sm text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
											href='/api/auth/logout'
										>
											<p className='px-4 py-2'>Logout</p>
										</Link>
									)}
								</div>
							</div>
							<div className='flex items-center lg:hidden'>
								<DisclosureButton className='hover:bg-background inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:outline-none focus:ring-inset'>
									<span className='sr-only'>{t('nav.open')}</span>
									{open ? (
										<XMarkIcon className='block h-6 w-6' aria-hidden='true' />
									) : (
										<Bars3Icon className='block h-6 w-6' aria-hidden='true' />
									)}
								</DisclosureButton>
							</div>
						</div>
					</div>
					<AppRouterMobileNav navigation={navigation} activeTab={activePath} />
				</>
			)}
		</Disclosure>
	)
}
