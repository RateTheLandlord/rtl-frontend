import { useMemo, useState } from 'react'
import ReportModal from '../reviews/report-modal'
import { Review as IReview } from '@/util/interfaces/interfaces'
import EditReviewModal from '../modal/EditReviewModal'
import RemoveReviewModal from '../modal/RemoveReviewModal'
import AdsComponent from '../adsense/Adsense'
import { fetchReviews } from '@/util/helpers/fetchReviews'
import ZipInfo from './ZipInfo'
import { IZipReviews } from '@/lib/review/types/review'
import useInfiniteScroll from '@/util/hooks/useInfiniteScroll'
import { ISortOptions } from '../reviews/review'
import ReviewTable from '../reviews/review-table'

interface IProps {
	city: string
	state: string
	country: string
	data: IZipReviews
	zip: string
}

const ZipPage = ({ city, state, country, zip, data }: IProps) => {
	// State
	const [editReviewOpen, setEditReviewOpen] = useState(false)
	const [reportOpen, setReportOpen] = useState<boolean>(false)
	const [removeReviewOpen, setRemoveReviewOpen] = useState(false)
	const [selectedReview, setSelectedReview] = useState<IReview | undefined>()

	// Query
	const queryParams = useMemo(() => {
		return {
			sort: 'new' as ISortOptions,
			state: state,
			country: country,
			city: city,
			zip: zip,
			search: '',
			limit: '25',
		}
	}, [city, state, country, zip])

	const { reviews, isLoading: isLoadingHook } = useInfiniteScroll<IReview>({
		fetchData: fetchReviews,
		queryParams,
		offset: 150,
	})

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
						{!reviews.length && !isLoadingHook ? (
							<div className='mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center p-6'>
								<h1 className='mt-4 text-3xl text-gray-900 sm:text-5xl'>
									No results found
								</h1>
								<p className='mt-6 text-base leading-7 text-gray-600'>
									Sorry, we couldn&apos;t find any results for those filters.
								</p>
							</div>
						) : (
							<ReviewTable
								data={reviews}
								setReportOpen={setReportOpen}
								setSelectedReview={setSelectedReview}
								setRemoveReviewOpen={setRemoveReviewOpen}
								setEditReviewOpen={setEditReviewOpen}
								isLoading={isLoadingHook}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default ZipPage
