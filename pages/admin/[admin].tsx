import React, { useState, type JSX } from 'react'
import { ITabs } from '@/components/admin/types/types'
import FlaggedReviews from '@/components/admin/sections/FlaggedReviews'
import DeletedReviews from '@/components/admin/sections/DeletedReviews'
import Link from 'next/link'
import Stats from '@/components/admin/sections/Stats'
import { classNames } from '@/util/helpers/helper-functions'
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	TransitionChild,
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import TenantResources from '@/components/admin/sections/TenantResources'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import { useUser } from '@auth0/nextjs-auth0/client'
import SuspiciousLandlords from '@/components/admin/sections/SuspiciousLandlords'
import FlaggedKeywords from '@/components/admin/sections/FlaggedKeywords'
import RecentReviews from '@/components/admin/sections/RecentReviews'
import MergeDuplicateLandlords from '@/components/admin/sections/MergeDuplicateLandlords'

const tabs = [
	{ name: 'Flagged Reviews', component: <FlaggedReviews /> },
	{ name: 'Tenant Resources', component: <TenantResources /> },
	{ name: 'Suspicous Landlords', component: <SuspiciousLandlords /> },
	{ name: 'Stats', component: <Stats /> },
	{ name: 'Flagged Keywords', component: <FlaggedKeywords /> },
	{ name: 'Deleted Reviews', component: <DeletedReviews /> },
	{ name: 'Recent Reviews', component: <RecentReviews /> },
	{ name: 'Merge Landlords', component: <MergeDuplicateLandlords /> },
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
					className='bg-primary hover:bg-primary-hover ml-3 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm text-white shadow-sm focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none'
				>
					Go To Login
				</Link>
			</div>
		)
	}

	return (
		<>
			<div className='h-full w-full'>
				<Dialog
					open={sidebarOpen}
					onClose={setSidebarOpen}
					className='relative z-50 lg:hidden'
				>
					<DialogBackdrop
						transition
						className='fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0'
					/>

					<div className='fixed inset-0 flex'>
						<DialogPanel
							transition
							className='relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full'
						>
							<TransitionChild>
								<div className='absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0'>
									<button
										type='button'
										onClick={() => setSidebarOpen(false)}
										className='-m-2.5 p-2.5'
									>
										<span className='sr-only'>Close sidebar</span>
										<XMarkIcon
											aria-hidden='true'
											className='size-6 text-white'
										/>
									</button>
								</div>
							</TransitionChild>

							<div className='relative flex grow flex-col gap-y-5 overflow-y-auto bg-white p-6 pb-2'>
								<nav className='relative flex flex-1 flex-col'>
									<ul role='list' className='flex flex-1 flex-col gap-y-7'>
										<li>
											<ul role='list' className='-mx-2 space-y-1'>
												{tabs.map((item) => (
													<li key={item.name}>
														<button
															onClick={() => setCurrentTab(item)}
															className={classNames(
																item.name === currentTab.name
																	? 'w-full bg-gray-50 text-indigo-600'
																	: 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
																'group flex gap-x-3 rounded-md p-2 text-sm/6',
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
					</div>
				</Dialog>

				{/* Static sidebar for desktop */}
				<div className='hidden lg:fixed lg:top-16 lg:bottom-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
					<div className='flex grow flex-col gap-y-5 overflow-y-auto border-t border-r border-gray-200 bg-white p-6'>
						<nav className='flex flex-1 flex-col'>
							<ul role='list' className='flex flex-1 flex-col gap-y-7'>
								<li>
									<ul role='list' className='flex flex-1 flex-col gap-y-7'>
										<li>
											<ul role='list' className='-mx-2 space-y-1'>
												{tabs.map((item) => (
													<li key={item.name}>
														<button
															onClick={() => setCurrentTab(item)}
															className={classNames(
																item.name === currentTab.name
																	? 'w-full bg-gray-50 text-indigo-600'
																	: 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
																'group flex gap-x-3 rounded-md p-2 text-sm/6',
															)}
														>
															{item.name}
														</button>
													</li>
												))}
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className='sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden'>
					<button
						type='button'
						onClick={() => setSidebarOpen(true)}
						className='-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden'
					>
						<span className='sr-only'>Open sidebar</span>
						<Bars3Icon aria-hidden='true' className='size-6' />
					</button>
					<div className='flex-1 text-sm/6 font-semibold text-gray-900'>
						Dashboard
					</div>
				</div>

				<main className='py-10 lg:pl-72'>
					<div className='px-4 sm:px-6 lg:px-8'>{currentTab.component}</div>
				</main>
			</div>
		</>
	)
}

export default withPageAuthRequired(Admin)

export const getStaticPaths = () => {
	return {
		paths: [],
		fallback: true,
	}
}

export async function getStaticProps({ locale }: { locale: string }) {
	const alertsMessages = (await import(
		`@/messages/${locale}/alerts.json`
	)) as Record<string, string>
	const layoutMessages = (await import(
		`@/messages/${locale}/layout.json`
	)) as Record<string, string>
	const reviewsMessages = (await import(
		`@/messages/${locale}/createreview.json`
	)) as Record<string, string>

	return {
		props: {
			messages: {
				...alertsMessages,
				...layoutMessages,
				...reviewsMessages,
			},
		},
	}
}
