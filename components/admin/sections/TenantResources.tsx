import { Fragment } from 'react'
import {
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	Transition,
} from '@headlessui/react'
import { classNames } from '@/util/helpers/helper-functions'
import { MenuAlt3Icon } from '@heroicons/react/solid'
import Button from '@/components/ui/button'
import useSWR from 'swr'
import { fetchWithBody } from '@/util/helpers/fetcher'
import Spinner from '@/components/ui/Spinner'
import { ResourceResponse } from '@/util/interfaces/interfaces'
import { useAppDispatch } from '@/redux/hooks'
import {
	updateAddResourceOpen,
	updateEditResourceOpen,
	updateRemoveResourceOpen,
	updateSelectedResource,
} from '@/redux/modal/modalSlice'

const TenantResources = () => {
	const { data, error } = useSWR<ResourceResponse, unknown>(
		['/api/tenant-resources/get-resources', { limit: '1000' }],
		fetchWithBody,
	)
	const dispatch = useAppDispatch()

	if (error) return <div>failed to load...</div>
	if (!data) return <Spinner />

	return (
		<div className='container flex w-full flex-col justify-center'>
			<div className='flex w-full justify-end'>
				<Button onClick={() => dispatch(updateAddResourceOpen(true))}>
					Add New Resource
				</Button>
			</div>
			{data.resources.length && (
				<ul
					role='list'
					className='mt-2 divide-y divide-gray-100 border-t border-gray-100'
				>
					{data.resources.map((resource) => (
						<li
							key={resource.id}
							className='flex items-center justify-between gap-x-6 py-3'
						>
							<div className='min-w-0'>
								<div className='flex items-center justify-start gap-x-3'>
									<p className='text-sm leading-6 text-gray-900'>
										{resource.name}
									</p>

									<p className='text-xs'>{resource.phone_number}</p>
								</div>
								<div className='mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500'>
									<p className='whitespace-nowrap'>
										{`${resource.address && `${resource.address},`} ${
											resource.city
										}, ${resource.state}, ${resource.country_code}`}
									</p>
									<svg viewBox='0 0 2 2' className='h-0.5 w-0.5 fill-current'>
										<circle cx={1} cy={1} r={1} />
									</svg>
									<p className='truncate'>{resource.description}</p>
								</div>
							</div>
							<div className='flex flex-none items-center gap-x-4'>
								<Menu as='div' className='relative flex-none'>
									<MenuButton className='-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900'>
										<span className='sr-only'>Open options</span>
										<MenuAlt3Icon className='h-5 w-5' aria-hidden='true' />
									</MenuButton>
									<Transition
										as={Fragment}
										enter='transition ease-out duration-100'
										enterFrom='transform opacity-0 scale-95'
										enterTo='transform opacity-100 scale-100'
										leave='transition ease-in duration-75'
										leaveFrom='transform opacity-100 scale-100'
										leaveTo='transform opacity-0 scale-95'
									>
										<MenuItems className='absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
											<MenuItem>
												{({ active }) => (
													<button
														onClick={() => {
															dispatch(updateEditResourceOpen(true))
															dispatch(updateSelectedResource(resource))
														}}
														className={classNames(
															active ? 'bg-gray-50' : '',
															'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900',
														)}
													>
														Edit
														<span className='sr-only'>, {resource.name}</span>
													</button>
												)}
											</MenuItem>

											<MenuItem>
												{({ active }) => (
													<button
														onClick={() => {
															dispatch(updateRemoveResourceOpen(true))
															dispatch(updateSelectedResource(resource))
														}}
														className={classNames(
															active ? 'bg-gray-50' : '',
															'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900',
														)}
													>
														Delete
														<span className='sr-only'>, {resource.name}</span>
													</button>
												)}
											</MenuItem>
										</MenuItems>
									</Transition>
								</Menu>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default TenantResources
