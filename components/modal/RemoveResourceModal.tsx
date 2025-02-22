import { Resource } from '@/util/interfaces/interfaces'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import Spinner from '../ui/Spinner'
import { toast } from 'react-toastify'
import CloseButton from '../ui/CloseButton'
import ButtonLight from '../ui/button-light'
import Button from '../ui/button'

interface IProps {
	selectedResource: Resource | undefined
	handleMutate: () => void
	setRemoveResourceOpen: Dispatch<SetStateAction<boolean>>
	removeResourceOpen: boolean
	setSelectedResource: Dispatch<SetStateAction<Resource | undefined>>
}

const RemoveResourceModal = ({
	selectedResource,
	handleMutate,
	setRemoveResourceOpen,
	removeResourceOpen,
	setSelectedResource,
}: IProps) => {
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
					handleMutate()
					setRemoveResourceOpen(false)
					toast.success('Success!')
					setSelectedResource(undefined)
				})
				.catch((err) => {
					console.log(err)
					toast.error('Failure: Something went wrong, please try again.')
					setSelectedResource(undefined)
				})
				.finally(() => setLoading(false))
		}
	}

	return (
		<Transition show={removeResourceOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={setRemoveResourceOpen}
			>
				<TransitionChild
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity' />
				</TransitionChild>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<DialogPanel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
								<div className='absolute top-0 right-0 hidden pt-4 pr-4 sm:block'>
									<CloseButton onClick={() => setRemoveResourceOpen(false)} />
								</div>
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
										<Dialog.Title
											as='h3'
											className='text-lg leading-6 text-gray-900'
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
									{loading ? (
										<Spinner />
									) : (
										<Button onClick={() => onSubmitRemoveResource()}>
											Remove
										</Button>
									)}

									<ButtonLight
										onClick={() => {
											setSelectedResource(undefined)
											setRemoveResourceOpen(false)
										}}
									>
										Cancel
									</ButtonLight>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default RemoveResourceModal
