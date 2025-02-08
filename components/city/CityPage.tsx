import { useEffect, useMemo, useState } from 'react'
import ReportModal from '../reviews/report-modal'
import { useTranslation } from 'next-i18next'
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
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import AnalyticsComponent from '../analytics/analytics'

interface IProps {
	city: string
	state: string
	country: string
	data: ICityReviews
}

const CityPage = ({ city, state, country, data }: IProps) => {
	// Localization
	const { t } = useTranslation('reviews')

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
	const [selectedIndex, setSelectedIndex] = useState(0)

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
			<div className='mt-3 w-full px-2 md:px-0'>
				<AdsComponent slot='1526837416' />
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
					<ButtonLight onClick={() => setMobileFiltersOpen(true)}>
						{t('reviews.filters')}
					</ButtonLight>
				</div>
				<div className='mx-auto max-w-2xl lg:max-w-7xl'>
					<TabGroup
						selectedIndex={selectedIndex}
						onChange={setSelectedIndex}
						as='div'
						className='w-full'
					>
						<TabList className='flex w-full justify-center gap-4 border-b p-3'>
							<Tab className='whitespace-nowrap border-b-2 border-transparent px-1 pb-2 text-3xl font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-600'>
								{t('reviews.reviews')}
							</Tab>
							<Tab className='whitespace-nowrap border-b-2 border-transparent px-1 pb-2 text-3xl font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-600'>
								<div className='flex flex-row gap-1'>
									<p>{t('reviews.analytics')}</p>
									<div className='flex h-full flex-col justify-start'>
										<span className='inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-teal-500/10'>
											{t('reviews.beta')}
										</span>
									</div>
								</div>
							</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
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
											<h1 className='mt-4 text-3xl text-gray-900 sm:text-5xl'>
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
							</TabPanel>
							<TabPanel>
								<AnalyticsComponent queryParams={queryParams} />
							</TabPanel>
						</TabPanels>
					</TabGroup>
				</div>
			</div>
		</>
	)
}

export default CityPage
