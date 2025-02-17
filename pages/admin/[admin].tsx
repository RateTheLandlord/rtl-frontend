import React, { Fragment, useState } from 'react'
import { ITabs } from '@/components/admin/types/types'
import FlaggedReviews from '@/components/admin/sections/FlaggedReviews'
import DeletedReviews from '@/components/admin/sections/DeletedReviews'
import Link from 'next/link'
import Stats from '@/components/admin/sections/Stats'
import { classNames } from '@/util/helpers/helper-functions'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { MenuIcon } from '@heroicons/react/outline'
import TenantResources from '@/components/admin/sections/TenantResources'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import { useUser } from '@auth0/nextjs-auth0/client'
import SuspiciousLandlords from '@/components/admin/sections/SuspiciousLandlords'
import FlaggedKeywords from '@/components/admin/sections/FlaggedKeywords'
import CloseButton from '@/components/ui/CloseButton'

const tabs = [
	{ name: 'Flagged Reviews', component: <FlaggedReviews /> },
	{ name: 'Tenant Resources', component: <TenantResources /> },
	{ name: 'Suspicous Landlords', component: <SuspiciousLandlords /> },
	{ name: 'Stats', component: <Stats /> },
	{ name: 'Flagged Keywords', component: <FlaggedKeywords /> },
	{ name: 'Deleted Reviews', component: <DeletedReviews /> },
]

function Admin(): JSX.Element {
	const [currentTab, setCurrentTab] = useState<ITabs>(tabs[0])

	const { user } = useUser()

	const [sidebarOpen, setSidebarOpen] = useState(false)

	if (!user || user.role !== 'ADMIN') {
		return (
			<div className='flex w-full flex-col items-center gap-4'>
				<h1 className='text-center'>Not Logged In</h1>
				<Link
					href='/login'
					className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none'
				>
					Go To Login
				</Link>
			</div>
		)
	}

	return (
		<div className='h-full w-screen'>
			<Transition show={sidebarOpen} as={Fragment}>
				<Dialog
					as='div'
					className='relative z-50 lg:hidden'
					onClose={setSidebarOpen}
				>
					<TransitionChild
						as={Fragment}
						enter='transition-opacity ease-linear duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='transition-opacity ease-linear duration-300'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-gray-900/80' />
					</TransitionChild>

					<div className='fixed inset-0 flex'>
						<TransitionChild
							as={Fragment}
							enter='transition ease-in-out duration-300 transform'
							enterFrom='-translate-x-full'
							enterTo='translate-x-0'
							leave='transition ease-in-out duration-300 transform'
							leaveFrom='translate-x-0'
							leaveTo='-translate-x-full'
						>
							<DialogPanel className='relative mr-16 flex w-full max-w-xs flex-1'>
								<TransitionChild
									as={Fragment}
									enter='ease-in-out duration-300'
									enterFrom='opacity-0'
									enterTo='opacity-100'
									leave='ease-in-out duration-300'
									leaveFrom='opacity-100'
									leaveTo='opacity-0'
								>
									<CloseButton onClick={() => setSidebarOpen(false)} />
								</TransitionChild>
								{/* Sidebar component, swap this element with another sidebar if you like */}
								<div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2'>
									<nav className='flex flex-1 flex-col'>
										<ul role='list' className='flex flex-1 flex-col gap-y-7'>
											<li>
												<ul role='list' className='-mx-2 space-y-1'>
													{tabs.map((item) => (
														<li key={item.name}>
															<button
																onClick={() => setCurrentTab(item)}
																className={classNames(
																	item === currentTab
																		? 'bg-gray-50 text-indigo-600'
																		: 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
																	'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
																)}
															>
																{item.name}
															</button>
														</li>
													))}
												</ul>
											</li>
										</ul>
									</nav>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</Dialog>
			</Transition>

			{/* Static sidebar for desktop */}
			<div className='hidden lg:fixed lg:top-16 lg:bottom-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div className='flex grow flex-col gap-y-5 overflow-y-auto border-t border-r border-gray-200 bg-white px-6'>
					<nav className='flex flex-1 flex-col'>
						<ul role='list' className='flex flex-1 flex-col gap-y-7 pt-2'>
							<li>
								<ul role='list' className='-mx-2 space-y-1'>
									{tabs.map((item) => (
										<li key={item.name}>
											<button
												onClick={() => setCurrentTab(item)}
												className={classNames(
													item === currentTab
														? 'bg-gray-50 text-indigo-600'
														: 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
													'group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6',
												)}
											>
												{item.name}
											</button>
										</li>
									))}
								</ul>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			<div className='sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden'>
				<button
					type='button'
					className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
					onClick={() => setSidebarOpen(true)}
				>
					<span className='sr-only'>Open sidebar</span>
					<MenuIcon className='h-6 w-6' aria-hidden='true' />
				</button>
				<div className='flex-1 text-sm leading-6 text-gray-900'>Dashboard</div>
			</div>

			<main className='py-10 lg:pl-72'>
				<div className='flex justify-center px-4 sm:px-6 lg:px-8'>
					{currentTab.component}
				</div>
			</main>
		</div>
	)
}

export default withPageAuthRequired(Admin)

export const getStaticPaths = (async () => {
	return {
	  paths: [
		{
		  params: {
			admin: 'placeholder',
		  },
		}, // See the "paths" section below
	  ],
	  fallback: true, // false or "blocking"
	}
  })

export async function getStaticProps({ locale }) {
	const alertsMessages = (await import(
		`@/messages/${locale}/alerts.json`
	)) as Record<string, string>
	const layoutMessages = (await import(
		`@/messages/${locale}/layout.json`
	)) as Record<string, string>
	return {
		props: {
			messages: {
				...alertsMessages,
				...layoutMessages
			},
		},
	}
}