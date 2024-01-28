import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { classNames } from '@/util/helpers/helper-functions'
import { MenuAlt3Icon } from '@heroicons/react/solid'
import Button from '@/components/ui/button'
import useSWR from 'swr'
import { fetchWithBody } from '@/util/helpers/fetcher'
import Spinner from '@/components/ui/Spinner'
import { Resource, ResourceResponse } from '@/util/interfaces/interfaces'
import AddResourceModal from '../components/AddResourceModal'
import Modal from '@/components/modal/Modal'
import EditResourceModal from '@/components/modal/EditResourceModal'
import RemoveResourceModal from '@/components/modal/RemoveResourceModal'
import { useAppDispatch } from '@/redux/hooks'
import { updateAlertOpen, updateAlertSuccess } from '@/redux/alert/alertSlice'

const TenantResources = () => {
	const { data, error, mutate } = useSWR<ResourceResponse>(
		['/api/tenant-resources/get-resources', { limit: '1000' }],
		fetchWithBody,
	)

	const dispatch = useAppDispatch()

	const [name, setName] = useState<string>('')
	const [country, setCountry] = useState<string>('CA')
	const [city, setCity] = useState<string>('')
	const [state, setState] = useState<string>('Alberta')
	const [address, setAddress] = useState('')
	const [phone, setPhone] = useState('')
	const [description, setDescription] = useState('')
	const [href, setHref] = useState('')
	const [loading, setLoading] = useState(false)

	const [selectedResource, setSelectedResource] = useState<
		Resource | undefined
	>()

	const [addResourceOpen, setAddResourceOpen] = useState(false)
	const [editResourceOpen, setEditResourceOpen] = useState(false)
	const [deleteResourceOpen, setDeleteResourceOpen] = useState(false)
	if (error) return <div>failed to load...</div>
	if (!data) return <Spinner />

	const resetForm = () => {
		setName('')
		setCity('')
		setCountry('CA')
		setState('Alberta')
		setAddress('')
		setPhone('')
		setDescription('')
		setHref('')
	}

	const onSubmitNewResource = () => {
		setLoading(true)
		const newResource = {
			name: name,
			country_code: country,
			city: city,
			state: state,
			address: address,
			phone_number: phone,
			description: description,
			href: href,
		}

		fetch('/api/tenant-resources/add-resource', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newResource),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				}
			})
			.then(() => {
				mutate()
				setAddResourceOpen(false)
				dispatch(updateAlertSuccess(true))
				dispatch(updateAlertOpen(true))
				resetForm()
			})
			.catch((err) => {
				console.log(err)
				dispatch(updateAlertSuccess(false))
				dispatch(updateAlertOpen(true))
			})
			.finally(() => setLoading(false))
	}

	const handleMutate = () => {
		mutate()
	}
	return (
		<div className='container flex w-full flex-col justify-center'>
			{editResourceOpen && (
				<EditResourceModal
					selectedResource={selectedResource}
					handleMutate={handleMutate}
					setEditResourceOpen={setEditResourceOpen}
					editResourceOpen={editResourceOpen}
					setSelectedResource={setSelectedResource}
				/>
			)}
			{deleteResourceOpen && (
				<RemoveResourceModal
					selectedResource={selectedResource}
					handleMutate={handleMutate}
					setRemoveResourceOpen={setDeleteResourceOpen}
					removeResourceOpen={deleteResourceOpen}
					setSelectedResource={setSelectedResource}
				/>
			)}
			{addResourceOpen && (
				<Modal
					loading={loading}
					title='Add Tenant Resource'
					open={addResourceOpen}
					setOpen={setAddResourceOpen}
					element={
						<AddResourceModal
							name={name}
							setName={setName}
							country={country}
							setCountry={setCountry}
							city={city}
							setCity={setCity}
							state={state}
							setState={setState}
							address={address}
							setAddress={setAddress}
							phone={phone}
							setPhone={setPhone}
							description={description}
							setDescription={setDescription}
							href={href}
							setHref={setHref}
						/>
					}
					onSubmit={onSubmitNewResource}
					buttonColour='blue'
					selectedId={1}
				/>
			)}
			<div className='flex w-full justify-end'>
				<Button onClick={() => setAddResourceOpen(true)} umami='add-resource'>
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
									<p className='text-sm font-semibold leading-6 text-gray-900'>
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
													<button
														onClick={() => {
															setEditResourceOpen(true)
															setSelectedResource(resource)
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
											</Menu.Item>

											<Menu.Item>
												{({ active }) => (
													<button
														onClick={() => {
															setDeleteResourceOpen(true)
															setSelectedResource(resource)
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
											</Menu.Item>
										</Menu.Items>
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
