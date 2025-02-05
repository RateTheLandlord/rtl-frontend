/* eslint-disable no-mixed-spaces-and-tabs */
import { Review } from '@/util/interfaces/interfaces'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { useUser } from '@auth0/nextjs-auth0/client'
import XIcon from '@heroicons/react/outline/XIcon'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

interface IProps {
	selectedReview: Review | undefined
	handleMutate: () => void
	setRestoreReviewOpen: Dispatch<SetStateAction<boolean>>
	restoreReviewOpen: boolean
	setSelectedReview: Dispatch<SetStateAction<Review | undefined>>
}

const RestoreReviewModal = ({
	selectedReview,
	handleMutate,
	setRestoreReviewOpen,
	restoreReviewOpen,
	setSelectedReview,
}: IProps) => {
	const [landlord, setLandlord] = useState<string>(
		selectedReview?.landlord || '',
	)
	const [restoreReason, setRestoreReason] = useState<string | null>(
		selectedReview?.restore_reason || null,
	)
	const restored_by = selectedReview?.restored_by || []
	const [review, setReview] = useState<string>(selectedReview?.review || '')
	const { user } = useUser()
	const date = dayjs().format('DD/MM/YYYY')

	const onSubmitRestoreReview = () => {
		restored_by.unshift(`${user?.admin_id} on ${date}`)
		const restoredReview = {
			...selectedReview,
			restore_date: date,
			restore_reason: restoreReason,
			restored_by: [...restored_by],
			delete_date: null,
		}
		if (selectedReview) {
			fetch('/api/review/edit-review', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(restoredReview),
			})
				.then((result) => {
					console.log('result entered')
					if (!result.ok) {
						throw new Error()
					}
				})
				.then(() => {
					console.log('post entered')
					fetch(
						`/api/force-revalidate?path=${encodeURIComponent(
							selectedReview.landlord,
						)}`,
					)
					handleMutate()
					setRestoreReviewOpen(false)
					toast.success('Success!')
					setSelectedReview(undefined)
				})
				.catch((err) => {
					console.log(err)
					toast.error('Failure: Something went wrong, please try again.')
					setSelectedReview(undefined)
				})
		}
	}

	return (
		<Transition show={restoreReviewOpen} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={setRestoreReviewOpen}>
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
							<DialogPanel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
								<div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
									<button
										type='button'
										className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
										onClick={() => setRestoreReviewOpen(false)}
									>
										<span className='sr-only'>Close</span>
										<XIcon className='h-6 w-6' aria-hidden='true' />
									</button>
								</div>
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
										<DialogTitle
											as='h3'
											className='text-lg  leading-6 text-gray-900'
										>
											Restore Review
										</DialogTitle>
									</div>
								</div>
								<div className='mt-1'>
									<div className='sm:col-span-3'>
										<label
											htmlFor='landlord'
											className='block text-sm  text-gray-700'
										>
											Landlord: {landlord ? landlord : selectedReview?.landlord}
										</label>
									</div>
									<div className='sm:col-span-2'>
										<label
											htmlFor='review'
											className='block text-sm  text-gray-700'
										>
											Review: {review ? review : selectedReview?.review}
										</label>
									</div>
									<div className='sm:col-span-2'>
										<label
											htmlFor='moderation-reason'
											className='block text-sm  text-gray-700'
										>
											Restore Reason
										</label>
										<div className='mt-1'>
											<input
												type='text'
												name='moderation-reason'
												id='moderation-reason'
												placeholder='Restore Reason'
												required
												value={restoreReason ? restoreReason : ''}
												onChange={(e) => setRestoreReason(e.target.value)}
												className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
												data-testid='create-review-form-moderation-reason-1'
											/>
										</div>
									</div>
									<div className='sm:col-span-2'>
										<label
											htmlFor='moderators'
											className='block text-sm  text-gray-700'
										>
											Previous Moderators
										</label>
										<div className='mt-1'>
											<p>{restored_by.map((mod) => mod).join(', ')}</p>
										</div>
									</div>
								</div>
								<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
									<button
										type='button'
										className={`inline-flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base  text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
										onClick={() => onSubmitRestoreReview()}
									>
										Submit
									</button>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base  text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm'
										onClick={() => {
											setSelectedReview(undefined)
											setRestoreReviewOpen(false)
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

export default RestoreReviewModal
