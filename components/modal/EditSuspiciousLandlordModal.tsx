import LargeTextInput from '@/components/ui/LargeTextInput'
import Spinner from '@/components/ui/Spinner'
import TextInput from '@/components/ui/TextInput'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateEditResourceOpen,
	updateSelectedSuspiciousLandlord,
} from '@/redux/modal/modalSlice'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'

const EditSuspiciousLandlordModal = () => {
	const {
		selectedSuspiciousLandlord: selectedSuspiciousLandlord,
		editSuspiciousLandlordOpen,
	} = useAppSelector((state) => state.modal)
	const dispatch = useAppDispatch()

	const [loading, setLoading] = useState(false)
	const [landlord, setLandlord] = useState<string>(
		selectedSuspiciousLandlord?.landlord || '',
	)
	const [message, setMessage] = useState<string>(
		selectedSuspiciousLandlord?.message || '',
	)

	const onSubmitEditResource = () => {
		setLoading(true)
		const editedResource = {
			...selectedSuspiciousLandlord,
			landlord: landlord,
			message: message,
		}
		fetch('/api/suspicious-landlords/edit-suspicious-landlord', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(editedResource),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				}
			})
			.then(() => {
				toast.success('Success!')
				dispatch(updateEditResourceOpen(false))
				dispatch(updateSelectedSuspiciousLandlord(undefined))
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
				dispatch(updateEditResourceOpen(false))
				dispatch(updateSelectedSuspiciousLandlord(undefined))
			})
			.finally(() => setLoading(false))
	}

	return (
		<Transition show={editSuspiciousLandlordOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={() => dispatch(updateEditResourceOpen(false))}
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
								<div className='mt-1'>
									<TextInput
										title='Landlord'
										value={
											landlord ? landlord : selectedSuspiciousLandlord?.landlord
										}
										setValue={setLandlord}
										id='landlord'
										placeHolder='Landlord'
									/>

									<LargeTextInput
										title='Message'
										setValue={setMessage}
										id='message'
										value={
											message ? message : selectedSuspiciousLandlord?.message
										}
									/>
								</div>
								<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
									<button
										type='button'
										disabled={loading}
										className={`inline-flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
										onClick={() => onSubmitEditResource()}
									>
										{loading ? <Spinner /> : 'Submit'}
									</button>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 shadow-sm hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm'
										onClick={() => {
											dispatch(updateEditResourceOpen(false))
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

export default EditSuspiciousLandlordModal
