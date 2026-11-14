import { UserUpdateReviewResponse } from '@/lib/review/types/Responses'
import { Review } from '@/util/interfaces/interfaces'
import { useUser } from '@auth0/nextjs-auth0/client'
import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import ModalShell from './ModalShell'

const SuspiciousReviewModal = ({
	onClose,
	selectedReview,
}: {
	onClose: () => void
	selectedReview: Review
}) => {
	const moderators = selectedReview?.moderator
		? [...selectedReview.moderator]
		: []
	const [suspiciousReason, setSuspiciousReason] = useState(
		selectedReview?.suspicious_reason,
	)

	const { user } = useUser()

	const date = dayjs().format('DD/MM/YYYY')

	const onSubmitEditReview = () => {
		if (typeof user?.admin_id === 'string') {
			moderators.unshift(`${user.admin_id} on ${date}`)
		}
		const apiUrl = '/api/review/edit-review'
		const editedReview = {
			...selectedReview,
			flagged: false,
			moderator: [...moderators],
			suspicious_reason: suspiciousReason,
		}
		fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(editedReview),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				} else {
					return result.json()
				}
			})
			.then((data: UserUpdateReviewResponse) => {
				fetch(
					`/api/force-revalidate?path=${encodeURIComponent(selectedReview.landlord)}`,
				).catch(() => console.error('Revalidate Failed'))
				if (data.success) {
					toast.success('Success!')
				} else {
					toast.error(data.message)
				}
				onClose()
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
				onClose()
			})
	}
	return (
		<ModalShell title='Edit Review' onClose={onClose}>
			<>
				<div className='sm:col-span-2'>
					<label
						htmlFor='suspicious-reason'
						className='block text-sm text-gray-700'
					>
						Suspicious Reason
					</label>
					<div className='mt-1'>
						<input
							type='text'
							name='suspicious-reason'
							id='suspicious-reason'
							placeholder='Suspicious Reason'
							required
							value={suspiciousReason ? suspiciousReason : ''}
							onChange={(e) => setSuspiciousReason(e.target.value)}
							className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
							data-testid='create-review-form-suspicious-reason-1'
						/>
					</div>
				</div>
				<div className='sm:col-span-2'>
					<label htmlFor='moderators' className='block text-sm text-gray-700'>
						Previous Moderators
					</label>
					<div className='mt-1'>
						<p>{moderators.map((mod) => mod).join(', ')}</p>
					</div>
				</div>
				<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
					<Button onClick={() => onSubmitEditReview()}>Submit</Button>
					<ButtonLight
						onClick={() => {
							onClose()
						}}
					>
						Cancel
					</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default SuspiciousReviewModal
