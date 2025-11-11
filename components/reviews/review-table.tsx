import { UserReview } from '@/util/interfaces/interfaces'
import React, { Dispatch, SetStateAction } from 'react'
import ReviewComponent from './ReviewComponent'
import Spinner from '../ui/Spinner'

interface IProps {
	data: UserReview[]
	setReportOpen: Dispatch<SetStateAction<boolean>>
	setSelectedReview: Dispatch<SetStateAction<UserReview | undefined>>
	setRemoveReviewOpen: Dispatch<SetStateAction<boolean>>
	setEditReviewOpen: Dispatch<SetStateAction<boolean>>
	userEditMode: boolean
	setUserEditMode: Dispatch<SetStateAction<boolean>>
	setUserEditReviewOpen: Dispatch<SetStateAction<boolean>>
	setUserRemoveReviewOpen: Dispatch<SetStateAction<boolean>>
	selectedReviewID: number | undefined
	isLoading: boolean
}

function ReviewTable({
	data,
	setReportOpen,
	setSelectedReview,
	setRemoveReviewOpen,
	setEditReviewOpen,
	userEditMode,
	setUserEditMode,
	setUserEditReviewOpen,
	setUserRemoveReviewOpen,
	selectedReviewID,
	isLoading,
}: IProps): JSX.Element {
	const handleReport = (review: UserReview) => {
		setSelectedReview(review)
		setReportOpen(true)
	}

	const handleDelete = (review: UserReview) => {
		setSelectedReview(review)
		setRemoveReviewOpen(true)
	}

	const handleEdit = (review: UserReview) => {
		setSelectedReview(review)
		setEditReviewOpen(true)
	}

	const handleUserEditMode = (review: UserReview) => {
		setSelectedReview(review)
		setUserEditMode(!userEditMode)
	}

	const handleUserEdit = (review: UserReview) => {
		setSelectedReview(review)
		setUserEditReviewOpen(true)
	}

	const handleUserDelete = (review: UserReview) => {
		setSelectedReview(review)
		setUserRemoveReviewOpen(true)
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
										handleDelete={handleDelete}
										handleEdit={handleEdit}
										handleUserEditMode={handleUserEditMode}
										userEditMode={userEditMode}
										handleUserEdit={handleUserEdit}
										handleUserDelete={handleUserDelete}
										selectedReviewID={selectedReviewID}
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
