import ReviewFilters from '@/components/reviews/review-filters'
import { sortOptions } from '@/util/helpers/filter-options'
import {
	Review as IReview,
	SortOptions,
	Options,
} from '@/util/interfaces/interfaces'
import {
	getCityOptions,
	getStateOptions,
	getZipOptions,
} from '@/components/reviews/functions'
import React, { useEffect, useMemo, useState } from 'react'
import ReportModal from '@/components/reviews/report-modal'
import EditReviewModal from '../modal/EditReviewModal'
import RemoveReviewModal from '../modal/RemoveReviewModal'
import InfiniteScroll from './InfiniteScroll'
import AdsComponent from '@/components/adsense/Adsense'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateActiveFilters } from '@/redux/query/querySlice'
import { fetchReviews } from '@/util/helpers/fetchReviews'
import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'
import MobileReviewFilters from './mobile-review-filters'
import { useTranslation } from 'react-i18next'
import ButtonLight from '../ui/button-light'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import MapComponent from '../Map/Map'
import { useRouter } from 'next/router'

export type ReviewsResponse = {
	reviews: IReview[]
	total: number
	countries: string[]
	states: string[]
	cities: string[]
	zips: string[]
	limit: number
}

export type ISortOptions =
	| 'az'
	| 'za'
	| 'new'
	| 'old'
	| 'high'
	| 'low'
	| undefined

export interface QueryParams {
	page: number
	sort: ISortOptions
	state: string
	country: string
	city: string
	zip: string
	search: string
	limit: string
}

const Review = ({ data }: { data: ReviewsResponse }) => {
	// Localization
	const { t } = useTranslation('reviews')

	const router = useRouter()
	const { view } = router.query

	// Redux
	const query = useAppSelector((state) => state.query)
	const { countryFilter, stateFilter, cityFilter, zipFilter, searchFilter } =
		query

	const dispatch = useAppDispatch()
	// State
	const [reviews, setReviews] = useState<IReview[]>(data?.reviews || [])
	const [page, setPage] = useState<number>(1)
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false)
	const [selectedSort, setSelectedSort] = useState<SortOptions>(sortOptions[2])
	const [editReviewOpen, setEditReviewOpen] = useState(false)
	const [hasMore, setHasMore] = useState(true) // Track if there is more content to load
	const [reportOpen, setReportOpen] = useState<boolean>(false)
	const [removeReviewOpen, setRemoveReviewOpen] = useState(false)
	const [selectedReview, setSelectedReview] = useState<IReview | undefined>()
	const [isLoading, setIsLoading] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(0)

	useEffect(() => {
		if (view && view === 'map') {
			setSelectedIndex(1)
		}
	}, [view])

	// Query
	const [queryParams, setQueryParams] = useState({
		sort: selectedSort.value,
		state: stateFilter?.value || '',
		country: countryFilter?.value || '',
		city: cityFilter?.value || '',
		zip: zipFilter?.value || '',
		search: searchFilter || '',
		limit: '25',
	})

	// Filtering and Infinite Loading
	const updateParams = () => {
		const params = {
			sort: selectedSort.value,
			state: stateFilter?.value || '',
			country: countryFilter?.value || '',
			city: cityFilter?.value || '',
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

	// Reset hasMore when queryParams change
	useEffect(() => {
		setHasMore(true)
	}, [queryParams])

	// Filtering Options
	const cityOptions = useMemo(
		() => getCityOptions(data?.cities ?? []),
		[data?.cities],
	)
	const [dynamicCityOptions, setDynamicCityOptions] =
		useState<Options[]>(cityOptions)
	const stateOptions = useMemo(
		() => getStateOptions(data?.states ?? []),
		[data?.states],
	)
	const [dynamicStateOptions, setDynamicStateOptions] =
		useState<Options[]>(stateOptions)
	const zipOptions = useMemo(
		() => getZipOptions(data?.zips ?? []),
		[data?.zips],
	)
	const [dynamicZipOptions, setDynamicZipOptions] =
		useState<Options[]>(zipOptions)

	const fetchDynamicFilterOptions = async () => {
		setIsLoading(true)
		try {
			const filterOptions = await fetchFilterOptions(
				queryParams?.country,
				queryParams?.state,
				queryParams?.city,
				queryParams?.zip,
			)
			setDynamicCityOptions(filterOptions.cities)
			setDynamicStateOptions(filterOptions.states)
			setDynamicZipOptions(filterOptions.zips)
		} catch (error) {
			console.error('Error fetching filter options:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
		fetchDynamicFilterOptions()
	}, [queryParams, page])

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
			<div className='w-full'>
				<AdsComponent slot='2009320000' />
				<div>
					<div className='mx-auto max-w-7xl border-b-gray-200 px-4 py-16 sm:px-6 lg:border-b lg:px-8'>
						<div>
							<h1 className='text-3xl   text-gray-900'>{t('reviews.title')}</h1>
							<p className='mt-4 max-w-xl text-sm text-gray-700'>
								{t('reviews.body')}
							</p>
						</div>
					</div>
				</div>
				<div className='flex w-full justify-end px-4 lg:hidden'>
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
								Reviews
							</Tab>
							<Tab className='whitespace-nowrap border-b-2 border-transparent px-1 pb-2 text-3xl font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-600'>
								<div className='flex flex-row gap-1'>
									<p>Map</p>
									<div className='flex h-full flex-col justify-start'>
										<span className='inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-teal-500/10'>
											Beta
										</span>
									</div>
								</div>
							</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								<div className='flex lg:flex-row lg:gap-2 lg:divide-x lg:divide-gray-200'>
									<MobileReviewFilters
										mobileFiltersOpen={mobileFiltersOpen}
										setMobileFiltersOpen={setMobileFiltersOpen}
										countryFilter={countryFilter}
										stateFilter={stateFilter}
										stateOptions={dynamicStateOptions}
										cityFilter={cityFilter}
										cityOptions={dynamicCityOptions}
										zipFilter={zipFilter}
										zipOptions={dynamicZipOptions}
										updateParams={updateParams}
									/>
									<ReviewFilters
										selectedSort={selectedSort}
										setSelectedSort={setSelectedSort}
										sortOptions={sortOptions}
										countryFilter={countryFilter}
										stateFilter={stateFilter}
										cityFilter={cityFilter}
										zipFilter={zipFilter}
										cityOptions={dynamicCityOptions}
										stateOptions={dynamicStateOptions}
										zipOptions={dynamicZipOptions}
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
							</TabPanel>
							<TabPanel>
								<MapComponent />
								<p className='mt-6 text-xs leading-7 text-gray-600'>
									This map component is currently in Beta. It is provided “as
									is” and may contain bugs, inaccuracies, or incomplete
									features. We are actively working to improve the functionality
									and accuracy of this component. <br />
									Please note: The map data may not be fully accurate or
									up-to-date. Some features may not work as expected.
									Performance may vary depending on your device and network
									conditions.
								</p>
							</TabPanel>
						</TabPanels>
					</TabGroup>
				</div>
			</div>
		</>
	)
}

export default Review
