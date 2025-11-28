import { UserReview } from '@/util/interfaces/interfaces'
import React from 'react'
import ReviewComponent from './ReviewComponent'
import Spinner from '../ui/Spinner'
import { useAppDispatch } from '@/redux/hooks'
import {
	updateSelectedReview,
	updateUserEditReviewOpen,
	updateUserRemoveReviewOpen,
	updateUserReportModal,
} from '@/redux/modal/modalSlice'

interface IProps {
	data: UserReview[]
	isLoading: boolean
	landlordPage?: boolean
}

function ReviewTable({
	data,
	isLoading,
	landlordPage = false,
}: IProps): JSX.Element {
	const dispatch = useAppDispatch()
	const handleReport = (review: UserReview) => {
		dispatch(updateSelectedReview(review))
		dispatch(updateUserReportModal(true))
	}

	const handleUserEdit = (review: UserReview) => {
		dispatch(updateSelectedReview(review))
		dispatch(updateUserEditReviewOpen(true))
	}

	const handleUserDelete = (review: UserReview) => {
		dispatch(updateSelectedReview(review))
		dispatch(updateUserRemoveReviewOpen(true))
	}

	if (!data.length || !data) {
		return <div data-testid='review-table-1-no-data'></div>
	}

	if (data.length) {
		return (
			<>
				<div data-testid='review-table-1'>
					<div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
						<div className='mt-6 space-y-5 pb-10'>
							{data.map((review: UserReview, i: number) => {
								return (
									<ReviewComponent
										key={review.id}
										review={review}
										i={i}
										handleReport={handleReport}
										handleUserEdit={handleUserEdit}
										handleUserDelete={handleUserDelete}
										landlordPage={landlordPage}
									/>
								)
							})}
							{isLoading && (
								<div
									data-testid='loading-test'
									className='flex w-full justify-center py-5'
								>
									<Spinner />
								</div>
							)}
						</div>
					</div>
				</div>
			</>
		)
	} else {
		return <></>
	}
}

export default ReviewTable
