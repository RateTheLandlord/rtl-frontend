/* eslint-disable no-mixed-spaces-and-tabs */
import { Resource } from '@/util/interfaces/interfaces'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { mutate } from 'swr'
import XIcon from '@heroicons/react/outline/XIcon'
import Spinner from '../ui/Spinner'
import { updateAlertOpen, updateAlertSuccess } from '@/redux/alert/alertSlice'
import { useAppDispatch } from '@/redux/hooks'

interface IProps {
	selectedResource: Resource | undefined
	mutateString: string
	setRemoveResourceOpen: Dispatch<SetStateAction<boolean>>
	removeResourceOpen: boolean
	setSelectedResource: Dispatch<SetStateAction<Resource | undefined>>
}

const RemoveResourceModal = ({
	selectedResource,
	mutateString,
	setRemoveResourceOpen,
	removeResourceOpen,
	setSelectedResource,
}: IProps) => {
	const dispatch = useAppDispatch()
	const [loading, setLoading] = useState(false)
	const onSubmitRemoveResource = () => {
		if (selectedResource) {
			setLoading(true)
			fetch('/api/tenant-resources/delete-resource', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: selectedResource.id }),
			})
				.then((result) => {
					if (!result.ok) {
						throw new Error()
					}
				})
				.then(() => {
					mutate(mutateString).catch((err) => console.log(err))
					setRemoveResourceOpen(false)
					dispatch(updateAlertSuccess(true))
					dispatch(updateAlertOpen(true))
					setSelectedResource(undefined)
				})
				.catch((err) => {
					console.log(err)
					dispatch(updateAlertSuccess(false))
					dispatch(updateAlertOpen(true))
					setSelectedResource(undefined)
				})
				.finally(() => setLoading(false))
		}
	}

	return (
		<Transition.Root show={removeResourceOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={setRemoveResourceOpen}
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
								<div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
									<button
										type='button'
										className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
										onClick={() => setRemoveResourceOpen(false)}
									>
										<span className='sr-only'>Close</span>
										<XIcon className='h-6 w-6' aria-hidden='true' />
									</button>
								</div>
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
										<Dialog.Title
											as='h3'
											className='text-lg font-medium leading-6 text-gray-900'
										>
											Remove Resource
										</Dialog.Title>
									</div>
								</div>
								<div>
									<div className='ml-4' data-testid='remove-review-modal-1'>
										<h2>
											Are you sure you want to remove this resource? This cannot
											be undone.
										</h2>
									</div>
								</div>
								<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
									<button
										type='button'
										disabled={loading}
										className={`hover:bg-red:700 inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
										onClick={() => onSubmitRemoveResource()}
									>
										{loading ? <Spinner /> : 'Remove'}
									</button>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm'
										onClick={() => {
											setSelectedResource(undefined)
											setRemoveResourceOpen(false)
										}}
									>
										Cancel
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default RemoveResourceModal
