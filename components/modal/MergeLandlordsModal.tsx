import { Fragment, useState } from 'react'
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import CloseButton from '../ui/CloseButton'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateDeleteNowOpen,
	updateMergeLandlordModalOpen,
} from '@/redux/modal/modalSlice'
import { toast } from 'react-toastify'
import {
	resetLandlords,
	updateLandlordName,
} from '@/redux/landlord/landlordSlice'
import TextInput from '../ui/TextInput'
import Spinner from '../ui/Spinner'

type FetchResponse = {
	success: boolean
	rowsUpdated: number
	message?: string
}

const MergeLandlordsModal = () => {
	const { mergeLandlordModalOpen } = useAppSelector((state) => state.modal)
	const { selectedLandlords, landlordName } = useAppSelector(
		(state) => state.landlord,
	)
	const { country } = useAppSelector((state) => state.review)
	const dispatch = useAppDispatch()

	const [isLoading, setIsLoading] = useState<boolean>(false)

	const onSubmit = () => {
		setIsLoading(true)
		fetch('/api/landlord-tools/merge-duplicate-landlords', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				masterName: landlordName,
				country,
				namesToMerge: selectedLandlords.map((landlord) => landlord.name),
			}),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Error: ${res.status}`)
				}
				return res.json()
			})
			.then((data: FetchResponse) => {
				if (data.success) {
					dispatch(updateMergeLandlordModalOpen(false))
					toast.success(`Success! ${data.rowsUpdated} reviews updated`)
				} else {
					throw new Error(data.message)
				}
			})
			.catch((err) => {
				dispatch(updateMergeLandlordModalOpen(false))
				toast.error(`${err}`)
			})
			.finally(() => {
				setIsLoading(false)
				dispatch(resetLandlords())
			})
	}

	return (
		<Transition show={mergeLandlordModalOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-99'
				onClose={() => dispatch(updateDeleteNowOpen(false))}
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

				<div className='fixed inset-0 z-50 overflow-y-auto'>
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
									onClick={() => dispatch(updateMergeLandlordModalOpen(false))}
								/>
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
										<DialogTitle
											as='h3'
											className='text-lg leading-6 text-gray-900'
										>
											Merge Selected Landlords - REVIEW CAREFULLY
										</DialogTitle>
									</div>
								</div>
								<div className='my-10 flex flex-col gap-4 px-4'>
									<TextInput
										title='Merged Landlord Name'
										value={landlordName}
										setValue={(str) => dispatch(updateLandlordName(str))}
										id='landlord'
									/>
									{selectedLandlords.map((landlord) => {
										return (
											<div>
												<p className='font-bold'>
													{`${landlord.name}`}{' '}
													<span className='font-normal'>will become</span>{' '}
													{`${landlordName}`}
												</p>
												<p>{`Match Score: ${(landlord.score * 100).toFixed(2)}%
`}</p>
												<p>{`${landlord.count} reviews in ${country}`}</p>
											</div>
										)
									})}
									<p>
										This will update{' '}
										{selectedLandlords.reduce(
											(acc, landlord) =>
												landlord.name === landlordName
													? acc + 0
													: acc + landlord.count,
											0,
										)}{' '}
										reviews
									</p>
								</div>

								{isLoading ? (
									<Spinner />
								) : (
									<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
										<Button disabled={isLoading} onClick={() => onSubmit()}>
											{`Merge ${selectedLandlords.length}`}
										</Button>
										<ButtonLight
											onClick={() => {
												dispatch(updateMergeLandlordModalOpen(false))
											}}
										>
											Cancel
										</ButtonLight>
									</div>
								)}
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default MergeLandlordsModal
