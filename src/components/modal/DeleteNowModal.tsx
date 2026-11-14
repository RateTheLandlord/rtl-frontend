import { Review } from '@/util/interfaces/interfaces'
import { toast } from 'react-toastify'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import ModalShell from './ModalShell'

const DeleteNow = ({
	onClose,
	selectedReview,
}: {
	onClose: () => void
	selectedReview: Review
}) => {
	const landlord = selectedReview?.landlord || ''

	const restored_by = selectedReview?.restored_by || []
	const review = selectedReview?.review || ''

	const onDeleteReview = () => {
		if (selectedReview) {
			fetch('/api/review/delete-review', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: selectedReview.id }),
			})
				.then((result) => {
					if (!result) {
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
		<ModalShell title='Delete review now - CANNOT BE UNDONE' onClose={onClose}>
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
						<label htmlFor='moderators' className='block text-sm text-gray-700'>
							Previous Moderators
						</label>
						<div className='mt-1'>
							<p>{restored_by.map((mod) => mod).join(', ')}</p>
						</div>
					</div>
				</div>
				<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
					<Button
						onClick={() => {
							void onDeleteReview()
						}}
					>
						DELETE NOW
					</Button>
					<ButtonLight onClick={onClose}>Cancel</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default DeleteNow
