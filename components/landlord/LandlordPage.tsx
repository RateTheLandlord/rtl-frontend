import { useEffect, useState } from 'react'
import ReportModal from '../reviews/report-modal'
import LandlordInfo from './LandlordInfo'
import OtherLandlordInfo from './OtherLandlord'
import { useTranslation } from 'react-i18next'
import { Review } from '@/util/interfaces/interfaces'
import { FlagIcon, StarIcon } from '@heroicons/react/solid'
import { classNames } from '@/util/helpers/helper-functions'
import ButtonLight from '../ui/button-light'
import Spinner from '../ui/Spinner'
import { sortOptions } from '@/util/helpers/filter-options'
import SortList from '../reviews/ui/sort-list'
import { ILandlordReviews} from '@/lib/review/review'
import Link from 'next/link'

const filteredSortOptions = sortOptions.slice(2)

interface IProps {
	landlord: string
	data: ILandlordReviews
}

const LandlordPage = ({ landlord, data }: IProps) => {
	const { t } = useTranslation('reviews')
	const [reportOpen, setReportOpen] = useState<boolean>(false)
	const [sortedReviews, setSortedReviews] = useState<Array<Review>>([])

	const [sortState, setSortState] = useState(filteredSortOptions[0])

	const [selectedReview, setSelectedReview] = useState<Review | undefined>()

	if (!data.reviews.length) return <Spinner />

	const handleReport = (review: Review) => {
		setSelectedReview(review)
		setReportOpen(true)
	}

	useEffect(() => {

		switch (sortState.value) {
			case 'new':
				const sortedOld = data.reviews.sort(
					(a, b) => Number(b.id) - Number(a.id),
				)
				setSortedReviews([...sortedOld])
				break
			case 'old':
				const sortedNew = data.reviews.sort(
					(a, b) => Number(a.id) - Number(b.id),
				)
				setSortedReviews([...sortedNew])
				break
			case 'high':
				const sortedHigh = data.reviews.sort((a, b) => {
					const aTotal =
						a.health + a.privacy + a.repair + a.respect + a.stability
					const bTotal =
						b.health + b.privacy + b.repair + b.respect + b.stability

					return Number(bTotal) - Number(aTotal)
				})
				setSortedReviews([...sortedHigh])
				break
			case 'low':
				const sortedLow = data.reviews.sort((a, b) => {
					const aTotal =
						a.health + a.privacy + a.repair + a.respect + a.stability
					const bTotal =
						b.health + b.privacy + b.repair + b.respect + b.stability

					return Number(aTotal) - Number(bTotal)
				})
				setSortedReviews([...sortedLow])
				break
		}
	}, [sortState, data.reviews])

	return (
		<>
			<ReportModal
				isOpen={reportOpen}
				setIsOpen={setReportOpen}
				selectedReview={selectedReview}
			/>
			<div className='mt-10 flex w-full justify-center'>
				<div className='mx-auto flex max-w-2xl flex-col gap-3 px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
					<LandlordInfo name={landlord} data={data} />
					<div className='flex w-full justify-start py-2'>
						<SortList
							state={sortState}
							setState={setSortState}
							options={filteredSortOptions}
							name={t('reviews.sort')}
						/>
					</div>
					<div className='flex w-full flex-col gap-3'>
						{sortedReviews.map((review) => {
							const ratings = [
								{ title: t('reviews.health'), rating: review.health },
								{ title: t('reviews.respect'), rating: review.respect },
								{ title: t('reviews.privacy'), rating: review.privacy },
								{ title: t('reviews.repair'), rating: review.repair },
								{ title: t('reviews.stability'), rating: review.stability },
							]
							const date = new Date(review.date_added).toLocaleDateString()
							return (
								<div
									key={review.id}
									className='flex flex-col rounded-lg border border-gray-100 shadow lg:flex-row lg:gap-x-8'
								>
									<div className='flex flex-row flex-wrap items-center justify-between bg-gray-50 p-2 lg:min-w-[250px] lg:max-w-[275px] lg:flex-col'>
										<div className='flex flex-col gap-2 text-start lg:text-center'>
											<div className='flex flex-col'>
												<Link
													href={`/cities/${encodeURIComponent(
														review.country_code,
													)}/${encodeURIComponent(
														review.state,
													)}/${encodeURIComponent(review.city)}`}
													className='w-full text-gray-500 hover:underline lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'
												>{`${review.city}, ${review.state}, ${
													review.country_code === 'GB'
														? 'UK'
														: review.country_code
												}, ${review.zip}`}</Link>
												<p className='text-gray-500 lg:mb-0 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'>
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
										<div className='flex flex-row items-center justify-start lg:mt-4'>
											<ButtonLight
												onClick={() => handleReport(review)}
												umami='Landlord / REPORT button'
											>
												<FlagIcon className='text-red-700' width={20} />
											</ButtonLight>
										</div>
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
											{/* {review.admin_edited ? (
												<p className="text-xs text-red-400">
													{t('reviews.edited')}
												</p>
											) : null} */}

											<p className='mt-3 space-y-6 text-sm text-gray-500'>
											{review.review}
											</p>
										</div>
									</div>
								</div>
							)
						})}
					</div>
					{data.otherLandlords.length > 0 && <OtherLandlordInfo data={data}/>}
				</div>
			</div>
		</>
	)
}

export default LandlordPage
