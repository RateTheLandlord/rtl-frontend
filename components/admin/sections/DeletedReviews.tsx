import { Review } from '@/util/interfaces/interfaces'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/util/helpers/fetcher'
import RestoreReviewModal from '@/components/modal/RestoreReviewModal'
import Spinner from '@/components/ui/Spinner'

const DeletedReviews = () => {
	const [deleteReviewOpen, setDeleteReviewOpen] = useState(false)
	const [selectedReview, setSelectedReview] = useState<Review | undefined>()

	const [flaggedReviews, setFlaggedReviews] = useState<Array<Review>>([])

	const [restoreReviewOpen, setRestoreReviewOpen] = useState(false)

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const {
		data: reviews,
		error,
		mutate,
	} = useSWR<Array<Review>>('/api/admin/get-deleted', fetcher)

	useEffect(() => {
		if (reviews) {
			if (reviews.length) {
				setFlaggedReviews([...reviews])
			}
		}
	}, [reviews])

	if (error) return <div>failed to load</div>
	if (!reviews) return <Spinner />


	const handleMutate = () => {
		mutate()
	}

	return (
		<div className='container flex w-full flex-wrap justify-center'>
			{selectedReview ? (
				<>
					<RestoreReviewModal
						selectedReview={selectedReview}
						handleMutate={handleMutate}
						setRestoreReviewOpen={setRestoreReviewOpen}
						restoreReviewOpen={restoreReviewOpen}
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
								Delete Reason
							</th>
							<th
								scope='col'
								className='hidden px-3 py-3.5 text-left text-sm  text-gray-900 sm:table-cell'
							>
								Review
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
										<dt className='sr-only'>Delete Reason</dt>
										<dd className='mt-1 truncate text-gray-500'>
											{review.delete_reason}
										</dd>
										<dt className='sr-only sm:hidden'>Review</dt>
										<dd className='mt-1 truncate text-gray-700 sm:hidden'>
											{review.review}
										</dd>
									</dl>
								</td>
								<td className='hidden max-w-xs px-3 py-4 text-sm text-gray-500 lg:table-cell'>
									{review.delete_reason}
								</td>
								<td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
									{review.review}
								</td>
								<td className='py-4 pl-3 pr-4 text-center text-sm  sm:pr-6'>
									<button
										onClick={() => {
											setSelectedReview(review)
											setRestoreReviewOpen((p) => !p)
										}}
										className='text-indigo-600 hover:text-indigo-900'
									>
										Restore
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

export default DeletedReviews
