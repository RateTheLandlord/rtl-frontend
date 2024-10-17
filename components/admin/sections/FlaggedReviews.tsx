import { Review } from '@/util/interfaces/interfaces'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/util/helpers/fetcher'
import EditReviewModal from '@/components/modal/EditReviewModal'
import RemoveReviewModal from '@/components/modal/RemoveReviewModal'
import Spinner from '@/components/ui/Spinner'
import { toast } from 'react-toastify'

const FlaggedReviews = () => {
	const [editReviewOpen, setEditReviewOpen] = useState(false)
	const [selectedReview, setSelectedReview] = useState<Review | undefined>()

	const [flaggedReviews, setFlaggedReviews] = useState<Array<Review>>([])

	const [removeReviewOpen, setRemoveReviewOpen] = useState(false)

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const {
		data: reviews,
		error,
		mutate,
	} = useSWR<Array<Review>>('/api/admin/get-flagged', fetcher)

	useEffect(() => {
		if (reviews) {
			if (reviews.length) {
				setFlaggedReviews([...reviews])
			}
		}
	}, [reviews])

	if (error) return <div>failed to load</div>
	if (!reviews) return <Spinner />

	const onSubmitApproveReview = (review: Review) => {
		const editedReview = {
			...review,
			admin_approved: true,
			flagged: false,
		}
		fetch('/api/review/edit-review', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(editedReview),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				}
			})
			.then(() => {
				mutate()
				toast.success('Success!')
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
			})
	}

	const handleMutate = () => {
		mutate()
	}

	return (
		<div className='container flex w-full flex-wrap justify-center'>
			{selectedReview ? (
				<>
					<EditReviewModal
						selectedReview={selectedReview}
						handleMutate={handleMutate}
						setEditReviewOpen={setEditReviewOpen}
						editReviewOpen={editReviewOpen}
						setSelectedReview={setSelectedReview}
					/>
					<RemoveReviewModal
						selectedReview={selectedReview}
						handleMutate={handleMutate}
						setRemoveReviewOpen={setRemoveReviewOpen}
						removeReviewOpen={removeReviewOpen}
						setSelectedReview={setSelectedReview}
					/>
				</>
			) : null}
			<div className='container -mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg'>
				<table className='min-w-full divide-y divide-gray-300'>
					<thead className='bg-gray-50'>
						<tr>
							<th
								scope='col'
								className='py-3.5 pl-4 pr-3 text-left text-sm  text-gray-900 sm:pl-6'
							>
								Landlord
							</th>
							<th
								scope='col'
								className='hidden px-3 py-3.5 text-left text-sm  text-gray-900 lg:table-cell'
							>
								Reason
							</th>
							<th
								scope='col'
								className='hidden px-3 py-3.5 text-left text-sm  text-gray-900 sm:table-cell'
							>
								Review
							</th>
							<th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
								<span className='sr-only'>Approve</span>
							</th>
							<th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
								<span className='sr-only'>Edit</span>
							</th>
							<th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
								<span className='sr-only'>Remove</span>
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 bg-white'>
						{flaggedReviews.map((review) => (
							<tr
								key={review.id}
								className={`${review.admin_approved ? 'bg-green-100' : ''}`}
							>
								<td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm  text-gray-900 sm:w-auto sm:max-w-none sm:pl-6'>
									{review.landlord}
									<dl className='lg:hidden'>
										<dt className='sr-only'>Reason</dt>
										<dd className='mt-1 truncate text-gray-500'>
											{review.flagged_reason}
										</dd>
										<dt className='sr-only sm:hidden'>Review</dt>
										<dd className='mt-1 truncate text-gray-700 sm:hidden'>
											{review.review}
										</dd>
									</dl>
								</td>
								<td className='hidden max-w-xs px-3 py-4 text-sm text-gray-500 lg:table-cell'>
									{review.flagged_reason}
								</td>
								<td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
									{review.review}
								</td>
								<td className='py-4 pl-3 pr-4 text-center text-sm  sm:pr-6'>
									<button
										onClick={() => {
											onSubmitApproveReview(review)
										}}
										className='text-indigo-600 hover:text-indigo-900'
									>
										Approve
									</button>
								</td>
								<td className='py-4 pl-3 pr-4 text-center text-sm  sm:pr-6'>
									<button
										onClick={() => {
											setSelectedReview(review)
											setEditReviewOpen(true)
										}}
										className='text-indigo-600 hover:text-indigo-900'
									>
										Edit
									</button>
								</td>
								<td className='py-4 pl-3 pr-4 text-center text-sm  sm:pr-6'>
									<button
										onClick={() => {
											setSelectedReview(review)
											setRemoveReviewOpen((p) => !p)
										}}
										className='text-indigo-600 hover:text-indigo-900'
									>
										Remove
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default FlaggedReviews
