/* eslint-disable no-mixed-spaces-and-tabs */
import { SuspiciousLandlord } from '@/util/interfaces/interfaces'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import XIcon from '@heroicons/react/outline/XIcon'
import { toast } from 'react-toastify'
import Spinner from '@/components/ui/Spinner'

interface IProps {
	selectedLandlord: SuspiciousLandlord | undefined
	handleMutate: () => void
	setRemoveSuspiciousLandlordOpen: Dispatch<SetStateAction<boolean>>
	removeSuspiciousLandlordOpen: boolean
	setSelectedSuspiciousLandlord: Dispatch<
		SetStateAction<SuspiciousLandlord | undefined>
	>
}

const RemoveSuspiciousLandlord = ({
	selectedLandlord,
	handleMutate,
	setRemoveSuspiciousLandlordOpen,
	removeSuspiciousLandlordOpen,
	setSelectedSuspiciousLandlord,
}: IProps) => {
	const [loading, setLoading] = useState(false)
	const onSubmitRemoveResource = () => {
		if (selectedLandlord) {
			setLoading(true)
			fetch('/api/suspicious-landlords/delete-suspicious-landlord', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: selectedLandlord.id }),
			})
				.then((result) => {
					if (!result.ok) {
						throw new Error()
					}
				})
				.then(() => {
					handleMutate()
					setRemoveSuspiciousLandlordOpen(false)
					toast.success('Success!')
					setSelectedSuspiciousLandlord(undefined)
				})
				.catch((err) => {
					console.log(err)
					toast.error('Failure: Something went wrong, please try again.')
					setSelectedSuspiciousLandlord(undefined)
				})
				.finally(() => setLoading(false))
		}
	}

	return (
		<Transition show={removeSuspiciousLandlordOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={setRemoveSuspiciousLandlordOpen}
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
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
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
							<DialogPanel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
								<div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
									<button
										type='button'
										className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
										onClick={() => setRemoveSuspiciousLandlordOpen(false)}
									>
										<span className='sr-only'>Close</span>
										<XIcon className='h-6 w-6' aria-hidden='true' />
									</button>
								</div>
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
										<Dialog.Title
											as='h3'
											className='text-lg  leading-6 text-gray-900'
										>
											Remove Landlord
										</Dialog.Title>
									</div>
								</div>
								<div>
									<div className='ml-4' data-testid='remove-review-modal-1'>
										<h2>
											Are you sure you want to remove this landlord's message?
											This cannot be undone.
										</h2>
									</div>
								</div>
								<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
									<button
										type='button'
										disabled={loading}
										className={`hover:bg-red:700 inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base  text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
										onClick={() => onSubmitRemoveResource()}
									>
										{loading ? <Spinner /> : 'Remove'}
									</button>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base  text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm'
										onClick={() => {
											setSelectedSuspiciousLandlord(undefined)
											setRemoveSuspiciousLandlordOpen(false)
										}}
									>
										Cancel
									</button>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default RemoveSuspiciousLandlord
