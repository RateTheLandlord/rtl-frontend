import { Review } from '@/util/interfaces/interfaces'
import { Dispatch, Fragment, SetStateAction } from 'react'
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { toast } from 'react-toastify'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import CloseButton from '../ui/CloseButton'

interface IProps {
	selectedReview: Review | undefined
	handleMutate: () => void
	setDeleteReviewOpen: Dispatch<SetStateAction<boolean>>
	deleteReviewOpen: boolean
	setSelectedReview: Dispatch<SetStateAction<Review | undefined>>
}

const DeleteNow = ({
	selectedReview,
	handleMutate,
	setDeleteReviewOpen,
	deleteReviewOpen,
	setSelectedReview,
}: IProps) => {
	const landlord = selectedReview?.landlord || ''

	const restored_by = selectedReview?.restored_by || []
	const review = selectedReview?.review || ''

	const onDeleteReview = () => {
		console.log(selectedReview.id)
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
					handleMutate()
					setDeleteReviewOpen(false)
					toast.success('Success!')
					setSelectedReview(undefined)
				})
				.catch((err) => {
					console.log(err)
					toast.error('Failure: Something went wrong, please try again.')
					setSelectedReview(undefined)
				})
		}
		handleMutate()
	}

	return (
		<Transition show={deleteReviewOpen} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={setDeleteReviewOpen}>
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
								<CloseButton onClick={() => setDeleteReviewOpen(false)} />
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
										<DialogTitle
											as='h3'
											className='text-lg leading-6 text-gray-900'
										>
											Delete review now - CANNOT BE UNDONE
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

									<div className='sm:col-span-2'>
										<label
											htmlFor='moderators'
											className='block text-sm text-gray-700'
										>
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
									<ButtonLight
										onClick={() => {
											setSelectedReview(undefined)
											setDeleteReviewOpen(false)
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

export default DeleteNow
