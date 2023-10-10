import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { classNames } from '@/util/helpers/helper-functions'
import { MenuAlt3Icon } from '@heroicons/react/solid'
import Button from '@/components/ui/button'

const projects = [
	{
		id: 1,
		name: 'Toronto Tenants Union',
		country_code: 'CA',
		city: 'Toronto',
		state: 'Ontario',
		address: '123 Fake St',
		phone_number: '123 456 7890',
		date_added: new Date(),
		description: 'this is a description',
		href: '#',
	},
]

const TenantResources = () => {
	return (
		<div className='container flex w-full flex-col justify-center'>
			<Button onClick={() => console.log('click')} umami='add-resource'>
				Add New Resource
			</Button>
			<ul role='list' className='divide-y divide-gray-100'>
				{projects.map((project) => (
					<li
						key={project.id}
						className='flex items-center justify-between gap-x-6 py-5'
					>
						<div className='min-w-0'>
							<div className='flex items-center justify-start gap-x-3'>
								<p className='text-sm font-semibold leading-6 text-gray-900'>
									{project.name}
								</p>

								<p className='text-xs'>{project.phone_number}</p>
							</div>
							<div className='mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500'>
								<p className='whitespace-nowrap'>
									<p>{`${project.address}, ${project.city}, ${project.state}, ${project.country_code}`}</p>
								</p>
								<svg viewBox='0 0 2 2' className='h-0.5 w-0.5 fill-current'>
									<circle cx={1} cy={1} r={1} />
								</svg>
								<p className='truncate'>{project.description}</p>
							</div>
						</div>
						<div className='flex flex-none items-center gap-x-4'>
							<Menu as='div' className='relative flex-none'>
								<Menu.Button className='-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900'>
									<span className='sr-only'>Open options</span>
									<MenuAlt3Icon className='h-5 w-5' aria-hidden='true' />
								</Menu.Button>
								<Transition
									as={Fragment}
									enter='transition ease-out duration-100'
									enterFrom='transform opacity-0 scale-95'
									enterTo='transform opacity-100 scale-100'
									leave='transition ease-in duration-75'
									leaveFrom='transform opacity-100 scale-100'
									leaveTo='transform opacity-0 scale-95'
								>
									<Menu.Items className='absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
										<Menu.Item>
											{({ active }) => (
												<a
													href='#'
													className={classNames(
														active ? 'bg-gray-50' : '',
														'block px-3 py-1 text-sm leading-6 text-gray-900',
													)}
												>
													Edit<span className='sr-only'>, {project.name}</span>
												</a>
											)}
										</Menu.Item>

										<Menu.Item>
											{({ active }) => (
												<a
													href='#'
													className={classNames(
														active ? 'bg-gray-50' : '',
														'block px-3 py-1 text-sm leading-6 text-gray-900',
													)}
												>
													Delete
													<span className='sr-only'>, {project.name}</span>
												</a>
											)}
										</Menu.Item>
									</Menu.Items>
								</Transition>
							</Menu>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default TenantResources
