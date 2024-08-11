import { useEffect, useState } from 'react'
import ReportModal from '../reviews/report-modal'
import { Review } from '@/util/interfaces/interfaces'
import { IZipReviews } from '@/lib/review/review'
import EditReviewModal from '../modal/EditReviewModal'
import RemoveReviewModal from '../modal/RemoveReviewModal'
import AdsComponent from '../adsense/Adsense'
import InfiniteScroll from '../reviews/InfiniteScroll'
import { fetchReviews } from '@/util/helpers/fetchReviews'
import ZipInfo from './ZipInfo'
import { ISortOptions } from '../reviews/review'

interface IProps {
	city: string
	state: string
	country: string
	data: IZipReviews
	zip: string
}

const ZipPage = ({ city, state, country, zip, data }: IProps) => {
	// State
	const [reviews, setReviews] = useState<Review[]>(data?.reviews || [])
	const [page, setPage] = useState<number>(1)
	const [editReviewOpen, setEditReviewOpen] = useState(false)
	const [hasMore, setHasMore] = useState(true) // Track if there is more content to load
	const [reportOpen, setReportOpen] = useState<boolean>(false)
	const [removeReviewOpen, setRemoveReviewOpen] = useState(false)
	const [selectedReview, setSelectedReview] = useState<Review | undefined>()
	const [isLoading, setIsLoading] = useState(false)

	// Query
	const queryParams = {
		sort: 'new' as ISortOptions,
		state: state,
		country: country,
		city: city,
		zip: zip,
		search: '',
		limit: '25',
	}

	const fetchData = async () => {
		setIsLoading(true)
		try {
			const moreData = await fetchReviews({ page, ...queryParams })

			setReviews((prevReviews) => {
				if (page === 1) {
					// Initial fetch
					return [...moreData.reviews]
				} else {
					// If page changed or neither page nor other query parameters changed, append new reviews
					return [...prevReviews, ...moreData.reviews]
				}
			})

			if (moreData.reviews.length <= 0 || reviews.length >= moreData.total) {
				setHasMore(false)
			} else {
				setHasMore(true)
			}
		} catch (error) {
			console.error('Error fetching reviews:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [queryParams, page])

	// Reset hasMore when queryParams change
	useEffect(() => {
		setHasMore(true)
	}, [queryParams])

	return (
		<>
			<ReportModal
				isOpen={reportOpen}
				setIsOpen={setReportOpen}
				selectedReview={selectedReview}
			/>
			{selectedReview ? (
				<>
					<EditReviewModal
						selectedReview={selectedReview}
						handleMutate={() => {
							console.log('')
						}}
						setEditReviewOpen={setEditReviewOpen}
						editReviewOpen={editReviewOpen}
						setSelectedReview={setSelectedReview}
					/>
					<RemoveReviewModal
						selectedReview={selectedReview}
						handleMutate={() => {
							console.log('')
						}}
						setRemoveReviewOpen={setRemoveReviewOpen}
						removeReviewOpen={removeReviewOpen}
						setSelectedReview={setSelectedReview}
					/>
				</>
			) : null}
			<div className='w-full px-2 md:px-0'>
				<AdsComponent slot='1526837416' />
				<div className='mx-auto mt-5 flex max-w-2xl flex-col gap-3 lg:max-w-7xl'>
					<ZipInfo
						city={city}
						state={state}
						country={country}
						average={data.average}
						total={data.total}
						averages={data.catAverages}
						zip={zip}
					/>
				</div>

				<div className='mx-auto max-w-2xl lg:max-w-7xl'>
					<div className='flex lg:flex-row lg:gap-2 lg:divide-x lg:divide-gray-200'>
						{!reviews.length ? (
							<div className='mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center p-6'>
								<h1 className='mt-4 text-3xl   text-gray-900 sm:text-5xl'>
									No results found
								</h1>
								<p className='mt-6 text-base leading-7 text-gray-600'>
									Sorry, we couldn't find any results for those filters.
								</p>
							</div>
						) : (
							<InfiniteScroll
								data={reviews}
								setReportOpen={setReportOpen}
								setSelectedReview={setSelectedReview}
								setRemoveReviewOpen={setRemoveReviewOpen}
								setEditReviewOpen={setEditReviewOpen}
								setPage={setPage}
								hasMore={hasMore}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default ZipPage
