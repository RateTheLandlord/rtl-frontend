import { Review } from '@/util/interfaces/interfaces'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/util/helpers/fetcher'
import RestoreReviewModal from '@/components/modal/RestoreReviewModal'
import Spinner from '@/components/ui/Spinner'
import dayjs from 'dayjs'

const DeletedReviews = () => {
	const [selectedReview, setSelectedReview] = useState<Review | undefined>()

	const [deletedReviews, setDeletedReviews] = useState<Array<Review>>([])

	const [restoreReviewOpen, setRestoreReviewOpen] = useState(false)

	const {
		data: reviews,
		error,
		mutate,
	} = useSWR<Array<Review>, unknown>('/api/admin/get-deleted', fetcher)

	useEffect(() => {
		if (reviews) {
			if (reviews.length) {
				const sorted = reviews.sort((a, b) =>
					dayjs(a.delete_date).isValid() && dayjs(b.delete_date).isValid()
						? dayjs(a.delete_date).valueOf() - dayjs(b.delete_date).valueOf()
						: 0,
				)
				setDeletedReviews([...sorted])
			}
		}
	}, [reviews])

	if (error) return <div>failed to load</div>
	if (!reviews) return <Spinner />

	const handleMutate = () => {
		mutate().catch(() => console.error('Failed to Mutate Deleted Reviews'))
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
			<div className='ring-opacity-5 container -mx-4 overflow-hidden shadow ring-1 ring-black sm:-mx-6 md:mx-0 md:rounded-lg'>
				<table className='min-w-full divide-y divide-gray-300'>
					<thead className='bg-gray-50'>
						<tr>
							<th
								scope='col'
								className='py-3.5 pr-3 pl-4 text-left text-sm text-gray-900 sm:pl-6'
							>
								Landlord
							</th>
							<th
								scope='col'
								className='hidden px-3 py-3.5 text-left text-sm text-gray-900 lg:table-cell'
							>
								Delete Reason
							</th>
							<th
								scope='col'
								className='hidden px-3 py-3.5 text-left text-sm text-gray-900 sm:table-cell'
							>
								Delete Date
							</th>
							<th
								scope='col'
								className='hidden px-3 py-3.5 text-left text-sm text-gray-900 sm:table-cell'
							>
								Review
							</th>
							<th
								scope='col'
								className='hidden px-3 py-3.5 text-center text-sm text-gray-900 sm:table-cell'
							>
								Restore
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 bg-white'>
						{deletedReviews.map((review) => (
							<tr
								key={review.id}
								className={`${review.admin_approved ? 'bg-green-100' : ''}`}
							>
								<td className='w-full max-w-0 py-4 pr-3 pl-4 text-sm text-gray-900 sm:w-auto sm:max-w-none sm:pl-6'>
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
								<td className='hidden max-w-xs px-3 py-4 text-sm text-gray-500 lg:table-cell'>
									{dayjs(review.delete_date).format('DD/MM/YYYY')}
								</td>
								<td className='hidden px-3 py-4 text-sm break-words hyphens-auto text-gray-500 sm:table-cell'>
									{review.review}
								</td>
								<td className='py-4 pr-4 pl-3 text-center text-sm sm:pr-6'>
									<button
										onClick={() => {
											setSelectedReview(review)
											setRestoreReviewOpen((p) => !p)
										}}
										className='cursor-pointer text-indigo-600 hover:text-indigo-900'
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
