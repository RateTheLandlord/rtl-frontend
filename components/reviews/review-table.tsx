import { Review } from '@/util/interfaces/interfaces'
import React, { Dispatch, SetStateAction } from 'react'
import ReviewComponent from './ReviewComponent'

interface IProps {
	data: Review[]
	setReportOpen: Dispatch<SetStateAction<boolean>>
	setSelectedReview: Dispatch<SetStateAction<Review | undefined>>
	setRemoveReviewOpen: Dispatch<SetStateAction<boolean>>
	setEditReviewOpen: Dispatch<SetStateAction<boolean>>
}

function ReviewTable({
	data,
	setReportOpen,
	setSelectedReview,
	setRemoveReviewOpen,
	setEditReviewOpen,
}: IProps): JSX.Element {
	const handleReport = (review: Review) => {
		setSelectedReview(review)
		setReportOpen(true)
	}

	const handleDelete = (review: Review) => {
		setSelectedReview(review)
		setRemoveReviewOpen(true)
	}

	const handleEdit = (review: Review) => {
		setSelectedReview(review)
		setEditReviewOpen(true)
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
							{data.map((review: Review, i: number) => {
								return (
									<ReviewComponent
										key={review.id}
										review={review}
										i={i}
										handleReport={handleReport}
										handleDelete={handleDelete}
										handleEdit={handleEdit}
									/>
								)
							})}
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
