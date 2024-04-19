import { useEffect, useMemo, useState } from 'react'
import ReportModal from '../reviews/report-modal'
import { useTranslation } from 'react-i18next'
import { Review, SortOptions } from '@/util/interfaces/interfaces'
import ButtonLight from '../ui/button-light'
import { sortOptions } from '@/util/helpers/filter-options'
import { ICityReviews } from '@/lib/review/review'
import EditReviewModal from '../modal/EditReviewModal'
import RemoveReviewModal from '../modal/RemoveReviewModal'
import AdsComponent from '../adsense/Adsense'
import InfiniteScroll from '../reviews/InfiniteScroll'
import CityFilters from './CityFilters'
import CityMobileFilters from './CityMobileFilters'
import { getZipOptions } from '../reviews/functions'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateActiveFilters } from '@/redux/query/querySlice'
import { fetchReviews } from '@/util/helpers/fetchReviews'
import CityInfo from './CityInfo'

interface IProps {
	city: string
	state: string
	country: string
	data: ICityReviews
}

const CityPage = ({ city, state, country, data }: IProps) => {
	// Localization
	const { t } = useTranslation('landlord')

	// Redux
	const query = useAppSelector((state) => state.query)
	const { countryFilter, stateFilter, cityFilter, zipFilter, searchFilter } =
		query

	const dispatch = useAppDispatch()
	// State
	const [reviews, setReviews] = useState<Review[]>(data?.reviews || [])
	const [page, setPage] = useState<number>(1)
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false)
	const [selectedSort, setSelectedSort] = useState<SortOptions>(sortOptions[2])
	const [editReviewOpen, setEditReviewOpen] = useState(false)
	const [hasMore, setHasMore] = useState(true) // Track if there is more content to load
	const [reportOpen, setReportOpen] = useState<boolean>(false)
	const [removeReviewOpen, setRemoveReviewOpen] = useState(false)
	const [selectedReview, setSelectedReview] = useState<Review | undefined>()
	const [isLoading, setIsLoading] = useState(false)

	// Query
	const [queryParams, setQueryParams] = useState({
		sort: selectedSort.value,
		state: state,
		country: country,
		city: city,
		zip: '',
		search: '',
		limit: '25',
	})

	// Filtering and Infinite Loading
	const updateParams = () => {
		const params = {
			sort: selectedSort.value,
			state: state,
			country: country,
			city: city,
			zip: zipFilter?.value || '',
			search: searchFilter || '',
			limit: '25',
		}
		dispatch(
			updateActiveFilters([stateFilter, countryFilter, cityFilter, zipFilter]),
		)
		setQueryParams(params)
		setPage(1)
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

	const zipOptions = useMemo(
		() => getZipOptions(data?.zips ?? []),
		[data?.zips],
	)

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
				<AdsComponent slot='2009320000' />
				<div className='mx-auto mt-5 flex max-w-2xl flex-col gap-3 lg:max-w-7xl'>
					<CityInfo
						city={city}
						state={state}
						country={country}
						average={data.average}
						total={data.total}
						averages={data.catAverages}
					/>
				</div>
				<div className='mt-2 flex w-full justify-end px-4 lg:hidden'>
					<ButtonLight
						onClick={() => setMobileFiltersOpen(true)}
						umami='Reviews / Review Filters'
					>
						{t('reviews.filters')}
					</ButtonLight>
				</div>
				<div className='mx-auto max-w-2xl lg:max-w-7xl'>
					<div className='flex lg:flex-row lg:gap-2 lg:divide-x lg:divide-gray-200'>
						<CityMobileFilters
							mobileFiltersOpen={mobileFiltersOpen}
							setMobileFiltersOpen={setMobileFiltersOpen}
							zipFilter={zipFilter}
							zipOptions={zipOptions}
							updateParams={updateParams}
						/>
						<CityFilters
							selectedSort={selectedSort}
							setSelectedSort={setSelectedSort}
							sortOptions={sortOptions}
							zipFilter={zipFilter}
							zipOptions={zipOptions}
							updateParams={updateParams}
							loading={isLoading}
						/>
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

export default CityPage
