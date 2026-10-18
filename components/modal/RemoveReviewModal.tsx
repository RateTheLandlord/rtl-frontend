import { UserUpdateReviewResponse } from '@/lib/review/types/Responses'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateAdminRemoveReviewOpen,
	updateSelectedAdminReview,
} from '@/redux/modal/modalSlice'
import { useUser } from '@auth0/nextjs-auth0/client'
import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import ModalShell from './ModalShell'

const REVIEW_PERIOD = process.env.REVIEW_PERIOD
const reviewPeriodNumber =
	isNaN(Number(REVIEW_PERIOD)) || Number(REVIEW_PERIOD) <= 0
		? 30 // default to 30 if the value is invalid
		: Number(REVIEW_PERIOD)

const RemoveReviewModal = () => {
	const { selectedAdminReview: selectedReview } = useAppSelector(
		(state) => state.modal,
	)
	const dispatch = useAppDispatch()
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
		const apiUrl = '/api/review/edit-review'
		const deletedReview = {
			...selectedReview,
			delete_reason: deleteReason,
			deleted_by: [...deleted_by],
			delete_date,
		}
		if (selectedReview) {
			fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(deletedReview),
			})
				.then((result) => {
					if (!result.ok) {
						dispatch(updateAdminRemoveReviewOpen(false))
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
					dispatch(updateAdminRemoveReviewOpen(false))
					if (data.success) {
						toast.success('Success!')
					} else {
						toast.error(data.message)
					}
					dispatch(updateSelectedAdminReview(undefined))
				})
				.catch((err) => {
					console.log(err)
					toast.error('Failure: Something went wrong, please try again.')
					dispatch(updateAdminRemoveReviewOpen(false))
					dispatch(updateSelectedAdminReview(undefined))
				})
		}
	}

	return (
		<ModalShell
			title='Remove Review'
			onClose={() => dispatch(updateAdminRemoveReviewOpen(false))}
		>
			<>
				<div className='mt-1'>
					<div className='sm:col-span-3'>
						<label htmlFor='landlord' className='block text-sm text-gray-700'>
							Landlord: {landlord ? landlord : selectedReview?.landlord}
						</label>
					</div>
					<div className='sm:col-span-2'>
						<label htmlFor='review' className='block text-sm text-gray-700'>
							Review: {review ? review : selectedReview?.review}
						</label>
					</div>
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
				</div>
				<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
					<Button onClick={() => onSubmitRemoveReview()}>Submit</Button>
					<ButtonLight
						onClick={() => {
							dispatch(updateAdminRemoveReviewOpen(false))
							dispatch(updateSelectedAdminReview(undefined))
						}}
					>
						Cancel
					</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default RemoveReviewModal
