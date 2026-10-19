import { Review } from '@/util/interfaces/interfaces'
import { useUser } from '@auth0/nextjs-auth0/client'
import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import ModalShell from './ModalShell'

const RestoreReviewModal = ({
	onClose,
	selectedReview,
}: {
	onClose: () => void
	selectedReview: Review
}) => {
	const landlord = selectedReview?.landlord || ''

	const [restoreReason, setRestoreReason] = useState<string | null>(
		selectedReview?.restore_reason || null,
	)
	const restored_by = selectedReview?.restored_by || []
	const review = selectedReview?.review || ''
	const { user } = useUser()
	const date = dayjs().format('DD/MM/YYYY')

	const onSubmitRestoreReview = () => {
		const restoredReview = {
			...selectedReview,
			restore_date: date,
			restore_reason: restoreReason,
			restored_by: [`${user?.admin_id as string} on ${date}`, ...restored_by],
			delete_date: null,
			delete_reason: null,
			deleted_by: null,
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
					if (!result.ok) {
						throw new Error()
					}
				})
				.then(() => {
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
							console.error(err)
						})
					toast.success('Success!')
					onClose()
				})
				.catch((err) => {
					console.log(err)
					toast.error('Failure: Something went wrong, please try again.')
					onClose()
				})
		}
	}

	return (
		<ModalShell title='Restore Review' onClose={onClose}>
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
					<div className='sm:col-span-2'>
						<label
							htmlFor='moderation-reason'
							className='block text-sm text-gray-700'
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
								className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								data-testid='create-review-form-moderation-reason-1'
							/>
						</div>
					</div>
					<div className='sm:col-span-2'>
						<label htmlFor='moderators' className='block text-sm text-gray-700'>
							Previous Moderators
						</label>
						<div className='mt-1'>
							<p>{restored_by.map((mod) => mod).join(', ')}</p>
						</div>
					</div>
				</div>
				<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
					<Button onClick={() => onSubmitRestoreReview()}>Submit</Button>
					<ButtonLight onClick={onClose}>Cancel</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default RestoreReviewModal
