import { UserReview } from '@/util/interfaces/interfaces'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { useUser } from '@auth0/nextjs-auth0/client'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import CloseButton from '../ui/CloseButton'
import { UserUpdateReviewResponse } from '@/lib/review/types/Responses'

const REVIEW_PERIOD = process.env.REVIEW_PERIOD
const reviewPeriodNumber =
	isNaN(Number(REVIEW_PERIOD)) || Number(REVIEW_PERIOD) <= 0
		? 30 // default to 30 if the value is invalid
		: Number(REVIEW_PERIOD)

interface IProps {
	selectedReview: UserReview | undefined
	handleMutate: () => void
	setRemoveReviewOpen: Dispatch<SetStateAction<boolean>>
	removeReviewOpen: boolean
	setSelectedReview: Dispatch<SetStateAction<UserReview | undefined>>
	userEditMode: boolean
	setUserEditMode: Dispatch<SetStateAction<boolean>>
	userKey: string
	setUserKey: Dispatch<SetStateAction<string>>
}

const RemoveReviewModal = ({
	selectedReview,
	handleMutate,
	setRemoveReviewOpen,
	removeReviewOpen,
	setSelectedReview,
	userEditMode,
	setUserEditMode,
	userKey,
	setUserKey,
}: IProps) => {
	const landlord = selectedReview?.landlord || ''

	const [deleteReason, setDeleteReason] = useState<string | null>(
		selectedReview?.delete_reason || null,
	)
	const deleted_by = selectedReview?.deleted_by || []
	const review = selectedReview?.review || ''
	const { user } = useUser()
	const delete_date = dayjs().add(reviewPeriodNumber, 'day').toDate()

	const date = dayjs().format('DD/MM/YYYY')

	const onSubmitRemoveReview = () => {
		deleted_by.unshift(`${user?.admin_id as string} on ${date}`)
		const apiUrl = userEditMode
			? '/api/user-update/delete'
			: '/api/review/edit-review'
		const deletedReview = {
			...selectedReview,
			delete_reason: deleteReason,
			deleted_by: [...deleted_by],
			delete_date,
		}
		const body = userEditMode
			? { id: selectedReview?.id, user_code: userKey }
			: deletedReview
		if (selectedReview) {
			fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})
				.then((result) => {
					if (!result.ok) {
						setUserKey('')
						setUserEditMode(false)
						throw new Error()
					} else {
						return result.json()
					}
				})
				.then((data: UserUpdateReviewResponse) => {
					fetch(
						`/api/force-revalidate?path=${encodeURIComponent(
							selectedReview.landlord,
						)}`,
					)
						.then((response) => {
							if (!response.ok) {
								throw new Error('Failed to revalidate')
							}
						})
						.catch((err) => {
							console.log(err)
							toast.error('Revalidation failed')
						})
					handleMutate()
					setRemoveReviewOpen(false)
					if (data.success) {
						toast.success('Success!')
					} else {
						toast.error(data.message)
					}
					setSelectedReview(undefined)
					setUserKey('')
					setUserEditMode(false)
				})
				.catch((err) => {
					console.log(err)
					toast.error('Failure: Something went wrong, please try again.')
					setSelectedReview(undefined)
				})
		}
	}

	return (
		<Transition show={removeReviewOpen} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={setRemoveReviewOpen}>
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
							<DialogPanel className='relative transform gap-3 overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
								<div className='absolute top-0 right-0 hidden pt-4 pr-4 sm:block'>
									<CloseButton onClick={() => setRemoveReviewOpen(false)} />
								</div>
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
										<DialogTitle
											as='h3'
											className='text-lg leading-6 text-gray-900'
										>
											Remove Review
										</DialogTitle>
									</div>
								</div>
								<div className='mt-1'>
									<div className='sm:col-span-3'>
										<label
											htmlFor='landlord'
											className='block text-sm text-gray-700'
										>
											Landlord: {landlord ? landlord : selectedReview?.landlord}
										</label>
									</div>
									<div className='sm:col-span-2'>
										<label
											htmlFor='review'
											className='block text-sm text-gray-700'
										>
											Review: {review ? review : selectedReview?.review}
										</label>
									</div>
									{userEditMode ? (
										<div className='sm:col-span-2'>
											<label
												htmlFor='user-code'
												className='block text-sm text-gray-700'
											>
												User Code
											</label>
											<div className='mt-1'>
												<input
													type='text'
													name='user-code'
													id='user-code'
													placeholder='Enter User Code Provided After Creating Review'
													required
													onChange={(e) => setUserKey(e.target.value)}
													className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
													data-testid='create-review-form-moderation-reason-1'
												/>
											</div>
										</div>
									) : (
										<div>
											<div className='sm:col-span-2'>
												<label
													htmlFor='moderation-reason'
													className='block text-sm text-gray-700'
												>
													Delete Reason
												</label>
												<div className='mt-1'>
													<input
														type='text'
														name='moderation-reason'
														id='moderation-reason'
														placeholder='Moderation Reason'
														required
														value={deleteReason ? deleteReason : ''}
														onChange={(e) => setDeleteReason(e.target.value)}
														className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
														data-testid='create-review-form-moderation-reason-1'
													/>
												</div>
											</div>
											<div className='sm:col-span-2'>
												<label
													htmlFor='moderators'
													className='block text-sm text-gray-700'
												>
													Previous Moderators
												</label>
												<div className='mt-1'>
													<p>{deleted_by.map((mod) => mod).join(', ')}</p>
												</div>
											</div>
										</div>
									)}
								</div>
								<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
									<Button onClick={() => onSubmitRemoveReview()}>Submit</Button>
									<ButtonLight
										onClick={() => {
											setSelectedReview(undefined)
											setRemoveReviewOpen(false)
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

export default RemoveReviewModal
