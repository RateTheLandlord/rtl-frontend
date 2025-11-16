import { Fragment, useState } from 'react'
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { toast } from 'react-toastify'
import Spinner from '@/components/ui/Spinner'
import CloseButton from '@/components/ui/CloseButton'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateRemoveSuspiciousLandlordOpen,
	updateSelectedSuspiciousLandlord,
} from '@/redux/modal/modalSlice'

const RemoveSuspiciousLandlordModal = () => {
	const {
		removeSuspiciousLandlordOpen,
		selectedSuspiciousLandlord: selectedLandlord,
	} = useAppSelector((state) => state.modal)
	const dispatch = useAppDispatch()
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
					toast.success('Success!')
					dispatch(updateRemoveSuspiciousLandlordOpen(false))
					dispatch(updateSelectedSuspiciousLandlord(undefined))
				})
				.catch((err) => {
					console.log(err)
					toast.error('Failure: Something went wrong, please try again.')
					dispatch(updateSelectedSuspiciousLandlord(undefined))
				})
				.finally(() => setLoading(false))
		}
	}

	return (
		<Transition show={removeSuspiciousLandlordOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={() => dispatch(updateRemoveSuspiciousLandlordOpen(false))}
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
								<CloseButton
									onClick={() =>
										dispatch(updateRemoveSuspiciousLandlordOpen(false))
									}
								/>
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
										<DialogTitle
											as='h3'
											className='text-lg leading-6 text-gray-900'
										>
											Remove Landlord
										</DialogTitle>
									</div>
								</div>
								<div>
									<div className='ml-4' data-testid='remove-review-modal-1'>
										<h2>
											Are you sure you want to remove this landlord&apos;s
											message? This cannot be undone.
										</h2>
									</div>
								</div>
								<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
									<button
										type='button'
										disabled={loading}
										className={`hover:bg-red:700 inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base text-white shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
										onClick={() => onSubmitRemoveResource()}
									>
										{loading ? <Spinner /> : 'Remove'}
									</button>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 shadow-sm hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm'
										onClick={() => {
											dispatch(updateRemoveSuspiciousLandlordOpen(false))
											dispatch(updateSelectedSuspiciousLandlord(undefined))
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

export default RemoveSuspiciousLandlordModal
