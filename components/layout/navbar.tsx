import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import Logo from '../svg/logo/logo'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { destroyCookie, parseCookies } from 'nookies'
import { updateUser } from '@/redux/user/userSlice'
import MobileNav from '@/components/layout/MobileNav'
import { navigation, socialLinks } from '@/components/layout/links'

export default function Navbar(): JSX.Element {
	const cookies = parseCookies()
	const { t } = useTranslation('layout')

	const [activeTab, setActiveTab] = useState<string>('/')
	const router = useRouter()

	const user = useAppSelector((state) => state.user)
	const dispatch = useAppDispatch()

	useEffect(() => {
		const urlString = router.pathname
		if (urlString.includes('reviews')) {
			setActiveTab('/reviews')
		} else if (urlString.includes('about')) {
			setActiveTab('/about')
		} else if (urlString.includes('create')) {
			setActiveTab('/create-review')
		} else if (urlString.includes('resources')) {
			setActiveTab('/resources')
		} else if (urlString.includes('admin')) {
			setActiveTab('/admin')
		} else {
			setActiveTab('/')
		}
	}, [router])

	const handleLogout = () => {
		destroyCookie(undefined, 'ratethelandlord')
		dispatch(
			updateUser({
				jwt: { access_token: undefined },
				result: { name: undefined },
			}),
		)
		localStorage.removeItem('rtlUserId')
	}

	useEffect(() => {
		const userID = localStorage.getItem('rtlUserId')
		if (cookies.ratethelandlord && userID) {
			const userInfo = {
				jwt: {
					access_token: cookies.ratethelandlord,
				},
				result: {
					name: userID,
				},
			}
			dispatch(updateUser(userInfo))
		}
	}, [cookies.ratethelandlord])

	return (
		<Disclosure as='nav' className='bg-white shadow'>
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
									<Link
										href='/'
										data-umami-event='Navbar / Rate The Landlord Link'
									>
										{t('layout.nav.title')}
									</Link>
								</div>
								<div className='hidden lg:ml-6 lg:flex lg:space-x-8'>
									{navigation.map((link) => (
										<div
											className={`${
												activeTab === link.href
													? 'border-b-2 border-teal-500'
													: ''
											} inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900`}
											key={link.href}
										>
											<Link href={link.href} data-umami-event={link.umami}>
												{t(link.name)}
											</Link>
										</div>
									))}
									{user?.jwt.access_token && (
										<div
											className={`${
												activeTab === '/admin'
													? 'border-b-2 border-teal-500'
													: ''
											} inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900`}
										>
											<Link href={`/admin/${user.result.name || 0}`}>
												Admin
											</Link>
										</div>
									)}
								</div>
							</div>
							<div className='flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end'>
								<div className='hidden justify-center space-x-6 lg:flex'>
									{socialLinks.map((item) => (
										<a
											data-umami-event={item.umami}
											key={item.name}
											href={item.href}
											className='flex items-center text-gray-400 hover:text-gray-500'
										>
											<span className='sr-only'>{item.name}</span>
											{item.icon}
										</a>
									))}
								</div>
								<div className='hidden lg:ml-6 lg:flex lg:space-x-8'>
									<div className='inline-flex cursor-pointer items-center rounded-md border border-transparent bg-teal-600 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'>
										<Link
											href='/create-review'
											data-umami-event='Navbar / Submit a Review Button'
										>
											<p className='px-4 py-2'>{t('layout.nav.submit')}</p>
										</Link>
									</div>
								</div>
								<div className='hidden lg:ml-6 lg:flex lg:space-x-8'>
									{user?.jwt.access_token && (
										<button
											className='inline-flex cursor-pointer items-center rounded-md border border-transparent bg-blue-600 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
											onClick={() => handleLogout()}
										>
											<p className='px-4 py-2'>Logout</p>
										</button>
									)}
								</div>
							</div>
							<div className='flex items-center lg:hidden'>
								<Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500'>
									<span className='sr-only'>{t('layout.nav.open')}</span>
									{open ? (
										<XIcon className='block h-6 w-6' aria-hidden='true' />
									) : (
										<MenuIcon className='block h-6 w-6' aria-hidden='true' />
									)}
								</Disclosure.Button>
							</div>
							<div className='flex items-center lg:hidden'></div>
						</div>
					</div>

					<MobileNav navigation={navigation} activeTab={activeTab} />
				</>
			)}
		</Disclosure>
	)
}
