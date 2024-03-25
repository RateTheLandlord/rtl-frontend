import { classNames } from '@/util/helpers/helper-functions'
import { Review } from '@/util/interfaces/interfaces'
import { FlagIcon, StarIcon } from '@heroicons/react/solid'
import React, { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import ButtonLight from '../ui/button-light'
import Link from 'next/link'
import AdsComponent from '@/components/adsense/Adsense'
import { useUser } from '@auth0/nextjs-auth0/client'

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
	const { t } = useTranslation('reviews')
	const { user } = useUser()

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
								const ratings = [
									{ title: t('reviews.health'), rating: review.health },
									{ title: t('reviews.respect'), rating: review.respect },
									{ title: t('reviews.privacy'), rating: review.privacy },
									{ title: t('reviews.repair'), rating: review.repair },
									{ title: t('reviews.stability'), rating: review.stability },
								]
								const date = new Date(review.date_added).toLocaleDateString()
								return (
									<div key={review.id}>
										{i % 20 === 0 && i !== 0 && (
											<AdsComponent
												slot='3829259014'
												format='fluid'
												layoutKey='-gw-3+1f-3d+2z'
											/>
										)}
										<div className='flex flex-col rounded-lg border border-gray-100 shadow lg:flex-row lg:gap-x-8'>
											<div className='flex flex-col items-center bg-gray-50 p-2 lg:min-w-[250px] lg:max-w-[275px] lg:flex-col'>
												<div className='flex w-full flex-row justify-between'>
													<Link
														href={`/landlord/${encodeURIComponent(
															review.landlord,
														)}`}
														className='col mb-4 flex w-full cursor-pointer flex-col break-words text-lg  hover:underline lg:mb-2 lg:items-center'
														data-umami-event='Reviews / Landlord Link'
													>
														<h6 className='text-center'>{review.landlord}</h6>
														<p className='text-center text-sm'>
															Read all reviews
														</p>
													</Link>
													<div className='flex flex-col text-end lg:hidden'>
														<p className='w-full text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'>{`${
															review.city
														}, ${review.state}, ${
															review.country_code === 'GB'
																? 'UK'
																: review.country_code
														}, ${review.zip}`}</p>
														<p className='mb-4 text-gray-500 lg:mb-0 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'>
															{date}
														</p>
													</div>
												</div>
												<div className='flex items-center'>
													{[0, 1, 2, 3, 4].map((star) => {
														let totalReview = 0
														for (let i = 0; i < ratings.length; i++) {
															totalReview += Number(ratings[i].rating)
														}
														const avgRating = Math.round(
															totalReview / ratings.length,
														)
														return (
															<StarIcon
																key={star}
																className={classNames(
																	avgRating > star
																		? 'text-yellow-400'
																		: 'text-gray-200',
																	'h-5 w-5 flex-shrink-0',
																)}
																aria-hidden='true'
															/>
														)
													})}
												</div>
												<div className='hidden flex-col text-center lg:flex'>
													<p className='w-full text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'>{`${
														review.city
													}, ${review.state}, ${
														review.country_code === 'GB'
															? 'UK'
															: review.country_code
													}, ${review.zip}`}</p>
													<p className='mb-4 text-gray-500 lg:mb-0 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'>
														{date}
													</p>
												</div>
												<div className='mt-4 flex flex-row justify-start'>
													<ButtonLight
														onClick={() => handleReport(review)}
														umami='Reviews / REPORT Button'
													>
														<FlagIcon className='text-red-700' width={20} />
													</ButtonLight>
												</div>
												{user && user.role === 'ADMIN' ? (
													<>
														<div className='mt-4 w-full'>
															<ButtonLight
																onClick={() => handleDelete(review)}
																umami='Reviews / Remove Review Button'
															>
																Remove Review
															</ButtonLight>
														</div>
														<div className='mt-4 w-full'>
															<ButtonLight
																onClick={() => handleEdit(review)}
																umami='Reviews / Edit Review Button'
															>
																Edit Review
															</ButtonLight>
														</div>
													</>
												) : null}
											</div>
											<div className='p-4 lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8'>
												<div className='flex h-full flex-col justify-between'>
													<div className='flex flex-row flex-wrap items-center gap-3 xl:col-span-1'>
														{ratings.map((rating) => {
															return (
																<div key={rating.title}>
																	<p>{rating.title}</p>
																	<div className='flex items-center'>
																		{[0, 1, 2, 3, 4].map((star) => (
																			<StarIcon
																				key={star}
																				className={classNames(
																					rating.rating > star
																						? 'text-yellow-400'
																						: 'text-gray-200',
																					'h-5 w-5 flex-shrink-0',
																				)}
																				aria-hidden='true'
																			/>
																		))}
																	</div>
																</div>
															)
														})}
														{review.rent && (
															<div className='flex w-full flex-col'>
																<p className='w-full'>{`${t('reviews.rent')}${
																	review.rent
																}`}</p>
																<p className='text-xs'>{t('reviews.local')}</p>
															</div>
														)}
													</div>
												</div>

												<div className='mt-4 lg:mt-6 xl:col-span-2 xl:mt-0'>
													<p>{t('reviews.review')}</p>
													{review.admin_edited ? (
														<p className='text-xs text-red-400'>
															{t('reviews.edited')}
														</p>
													) : null}

													<p className='mt-3 space-y-6 text-sm text-gray-500'>
														{review.review}
													</p>
												</div>
											</div>
										</div>
									</div>
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
