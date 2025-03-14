import ReviewFilters from '@/components/reviews/review-filters'
import { sortOptions } from '@/util/helpers/filter-options'
import {
	Review as IReview,
	SortOptions,
	Options,
} from '@/util/interfaces/interfaces'
import React, { useEffect, useState } from 'react'
import ReportModal from '@/components/reviews/report-modal'
import EditReviewModal from '../modal/EditReviewModal'
import RemoveReviewModal from '../modal/RemoveReviewModal'
import { fetchReviews } from '@/util/helpers/fetchReviews'
import MobileReviewFilters from './mobile-review-filters'
import { useTranslations } from 'next-intl'
import ButtonLight from '../ui/button-light'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import MapComponent from '../Map/Map'
import AnalyticsComponent from '../analytics/analytics'
import StateInfo from './components/StateInfo'
import { debounce } from 'lodash'
import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/router'
import useScreenWidth from '@/util/hooks/useScreenWidth'
import useInfiniteScroll from '@/util/hooks/useInfiniteScroll'
import ReviewTable from './review-table'

export interface ReviewsResponse {
	reviews: IReview[]
	total: number
	countries: string[]
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

interface ReviewProps {
	view: string | string[] | undefined
	setLocationOpen: (bool: boolean) => void
}

const Review = ({ view, setLocationOpen }: ReviewProps) => {
	// Localization
	const t = useTranslations('reviews')

	const screenWidth = useScreenWidth()

	const router = useRouter()
	const { affiliate } = router.query

	// State
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false)
	const [selectedSort, setSelectedSort] = useState<SortOptions>(sortOptions[2])
	const [editReviewOpen, setEditReviewOpen] = useState(false)
	const [reportOpen, setReportOpen] = useState<boolean>(false)
	const [removeReviewOpen, setRemoveReviewOpen] = useState(false)
	const [selectedReview, setSelectedReview] = useState<IReview | undefined>()
	const [selectedIndex, setSelectedIndex] = useState(0)

	const [dynamicCityOptions, setDynamicCityOptions] = useState<Options[]>([])

	const [dynamicZipOptions, setDynamicZipOptions] = useState<Options[]>([])

	useEffect(() => {
		if (view && view === 'map' && screenWidth > 1025) {
			setSelectedIndex(1)
		}
	}, [view, screenWidth])

	// Redux
	const query = useAppSelector((state) => state.query)
	const { countryFilter, stateFilter, cityFilter, zipFilter, searchFilter } =
		query
	const dispatch = useAppDispatch()

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
		// Only update state if the new params are different from the current ones
		if (JSON.stringify(params) !== JSON.stringify(queryParams)) {
			setQueryParams(params)
		}
	}

	const fetchDynamicFilterOptions = debounce(async () => {
		try {
			const filterOptions = await fetchFilterOptions(
				countryFilter?.value,
				stateFilter?.value,
				cityFilter?.value,
				zipFilter?.value,
			)
			setDynamicCityOptions(filterOptions.cities)
			setDynamicZipOptions(filterOptions.zips)
		} catch {
			console.error('Error fetching filter options')
		}
	}, 300)

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
			<div className='w-full'>
				<div className='mx-auto max-w-7xl border-b-gray-200 px-4 py-4 sm:px-6 lg:border-b lg:px-8'>
					<StateInfo
						country={affiliate ? 'CA' : countryFilter?.value || ''}
						state={affiliate ? 'NOVA SCOTIA' : stateFilter?.value || ''}
						setLocationOpen={setLocationOpen}
					/>
					<div className='mt-3'>
						<h1 className='text-3xl text-gray-900'>{t('title')}</h1>
						<p className='mt-4 max-w-xl text-sm text-gray-700'>{t('body')}</p>
					</div>
				</div>
			</div>

			<div className='w-full'>
				<div className='flex w-full justify-end px-4 lg:hidden'>
					<ButtonLight onClick={() => setMobileFiltersOpen(true)}>
						{t('filters')}
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
							<Tab className='border-b-2 border-transparent px-1 pb-2 text-3xl font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-600'>
								{t('reviews')}
							</Tab>
							{screenWidth <= 1025 ? null : (
								<Tab className='border-b-2 border-transparent px-1 pb-2 text-3xl font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-600'>
									<div className='flex flex-row gap-1'>
										<p>{t('map')}</p>
										<div className='flex h-full flex-col justify-start'>
											<span className='inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-teal-500/10 ring-inset'>
												{t('beta')}
											</span>
										</div>
									</div>
								</Tab>
							)}
							<Tab className='border-b-2 border-transparent px-1 pb-2 text-3xl font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-600'>
								<div className='flex flex-row gap-1'>
									<p>{t('analytics')}</p>
									<div className='flex h-full flex-col justify-start'>
										<span className='inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-teal-500/10 ring-inset'>
											{t('beta')}
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
										cityFilter={cityFilter}
										zipFilter={zipFilter}
										dynamicCityOptions={dynamicCityOptions}
										zipOptions={dynamicZipOptions}
										dynamicZipOptions={dynamicZipOptions}
										updateParams={updateParams}
										dispatch={dispatch}
										fetchDynamicFilterOptions={fetchDynamicFilterOptions}
										query={query}
									/>
									<ReviewFilters
										selectedSort={selectedSort}
										setSelectedSort={setSelectedSort}
										sortOptions={sortOptions}
										countryFilter={countryFilter}
										stateFilter={stateFilter}
										cityFilter={cityFilter}
										zipFilter={zipFilter}
										dynamicCityOptions={dynamicCityOptions}
										zipOptions={dynamicZipOptions}
										dynamicZipOptions={dynamicZipOptions}
										updateParams={updateParams}
										dispatch={dispatch}
										fetchDynamicFilterOptions={fetchDynamicFilterOptions}
										query={query}
									/>
									{!reviews.length && !isLoadingHook ? (
										<div className='mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center p-6'>
											<h1 className='mt-4 text-3xl text-gray-900 sm:text-5xl'>
												No results found
											</h1>
											<p className='mt-6 text-base leading-7 text-gray-600'>
												Sorry, we couldn&apos;t find any results for those
												filters.
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
							</TabPanel>
							{screenWidth <= 1025 ? null : (
								<TabPanel>
									<MapComponent
										countryFilter={countryFilter}
										stateFilter={stateFilter}
									/>
									<p className='mt-6 text-xs leading-7 text-gray-600'>
										This map component is currently in Beta. It is provided “as
										is” and may contain bugs, inaccuracies, or incomplete
										features. We are actively working to improve the
										functionality and accuracy of this component. <br />
										Please note: The map data may not be fully accurate or
										up-to-date. Some features may not work as expected.
										Performance may vary depending on your device and network
										conditions.
									</p>
								</TabPanel>
							)}
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

export default Review
