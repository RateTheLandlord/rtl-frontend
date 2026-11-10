import ReviewFilters from '@/components/reviews/review-filters'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	clearReviewFilters,
	updateCity,
	updateSearch,
	updateZip,
} from '@/redux/query/querySlice'
import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'
import { fetchReviews } from '@/util/helpers/fetchReviews'
import { sortOptions } from '@/util/helpers/filter-options'
import useInfiniteScroll from '@/util/hooks/useInfiniteScroll'
import useScreenWidth from '@/util/hooks/useScreenWidth'
import {
	UserReview as IReview,
	Options,
	SortOptions,
} from '@/util/interfaces/interfaces'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { useEffect, useRef, useState } from 'react'
import MapComponent from '../Map/Map'
import AnalyticsComponent from '../analytics/analytics'
import ButtonLight from '../ui/button-light'
import StateInfo from './components/StateInfo'
import MobileReviewFilters from './mobile-review-filters'
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
	'az' | 'za' | 'new' | 'old' | 'high' | 'low' | undefined

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

type ReviewQueryParams = Omit<QueryParams, 'page'>
type FilterSource = 'desktop' | 'mobile'

interface ReviewProps {
	view: string | string[] | undefined
	setLocationOpen: (bool: boolean) => void
}

const buildQueryParams = (
	filters: {
		stateFilter: Options | null
		countryFilter: Options | null
		cityFilter: Options | null
		zipFilter: Options | null
		searchFilter: string | undefined
	},
	sort: SortOptions | null,
): ReviewQueryParams => ({
	sort: sort?.value,
	state: filters.stateFilter?.value || '',
	country: filters.countryFilter?.value || '',
	city: filters.cityFilter?.value || '',
	zip: filters.zipFilter?.value || '',
	search: filters.searchFilter || '',
	limit: '25',
})

const Review = ({ view, setLocationOpen }: ReviewProps) => {
	const t = useTranslations('reviews')
	const screenWidth = useScreenWidth()
	const router = useRouter()
	const { affiliate } = router.query

	const dispatch = useAppDispatch()
	const query = useAppSelector((state) => state.query)

	const { countryFilter, stateFilter, cityFilter, zipFilter, searchFilter } =
		query

	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
	const [selectedSort, setSelectedSort] = useState<SortOptions | null>(
		sortOptions[2],
	)
	const [selectedIndex, setSelectedIndex] = useState(0)

	const [dynamicCityOptions, setDynamicCityOptions] = useState<Options[]>([])
	const [dynamicZipOptions, setDynamicZipOptions] = useState<Options[]>([])

	const initialQueryParams = buildQueryParams(query, sortOptions[2])

	const [queryParams, setQueryParams] =
		useState<ReviewQueryParams>(initialQueryParams)

	const lastAppliedParams = useRef<ReviewQueryParams>(initialQueryParams)

	// Fetch dynamic filter options in one place.
	// ZIP is intentionally not a dependency: the endpoint uses country, state
	// and city to determine the available city and ZIP options.
	useEffect(() => {
		const controller = new AbortController()

		const timeout = window.setTimeout(() => {
			const fetchOptions = async () => {
				try {
					const filterOptions = await fetchFilterOptions(
						countryFilter?.value,
						stateFilter?.value,
						cityFilter?.value,
						controller.signal,
					)

					if (!controller.signal.aborted) {
						setDynamicCityOptions(filterOptions.cities)
						setDynamicZipOptions(filterOptions.zips)
					}
				} catch (error) {
					if (!controller.signal.aborted) {
						console.error('Error fetching filter options:', error)
					}
				}
			}

			void fetchOptions()
		}, 300)

		return () => {
			window.clearTimeout(timeout)
			controller.abort()
		}
	}, [countryFilter?.value, stateFilter?.value, cityFilter?.value])

	useEffect(() => {
		if (view === 'map' && screenWidth > 1025) {
			setSelectedIndex(1)
		}
	}, [view, screenWidth])

	useEffect(() => {
		if (selectedIndex === 1) {
			posthog.capture('reviews_map_viewed', {
				source: 'reviews',
				tab: 'map',
			})
		}

		if (selectedIndex === 2) {
			posthog.capture('reviews_analytics_viewed', {
				source: 'reviews',
				tab: 'analytics',
			})
		}
	}, [selectedIndex])

	const { reviews, isLoading: isLoadingHook } = useInfiniteScroll<IReview>({
		fetchData: fetchReviews,
		queryParams,
		offset: 150,
	})

	const handleApplyFilters = (source: FilterSource) => {
		const nextParams = buildQueryParams(query, selectedSort)
		const previousParams = lastAppliedParams.current

		const filtersChanged =
			nextParams.city !== previousParams.city ||
			nextParams.zip !== previousParams.zip

		const searchChanged = nextParams.search !== previousParams.search
		const sortChanged = nextParams.sort !== previousParams.sort

		if (filtersChanged) {
			const filterTypes = [
				nextParams.city !== previousParams.city ? 'city' : null,
				nextParams.zip !== previousParams.zip ? 'zip' : null,
			].filter(Boolean)

			posthog.capture('reviews_filter_applied', {
				source,
				filter_types: filterTypes,
				active_filter_count: [nextParams.city, nextParams.zip].filter(Boolean)
					.length,
			})
		}

		if (searchChanged && nextParams.search) {
			posthog.capture('reviews_search_performed', {
				source,
				search_type: 'reviews',
			})
		}

		if (sortChanged) {
			posthog.capture('reviews_sort_changed', {
				source,
				sort_option: nextParams.sort,
			})
		}

		lastAppliedParams.current = nextParams
		setQueryParams(nextParams)
	}

	const handleClearFilters = (source: FilterSource) => {
		const previousParams = lastAppliedParams.current

		const clearedTypes = [
			previousParams.city ? 'city' : null,
			previousParams.zip ? 'zip' : null,
			previousParams.search ? 'search' : null,
			previousParams.sort !== sortOptions[2].value ? 'sort' : null,
		].filter(Boolean)

		if (clearedTypes.length > 0) {
			posthog.capture('reviews_filter_cleared', {
				source,
				filter_types: clearedTypes,
			})
		}

		dispatch(clearReviewFilters())
		setSelectedSort(sortOptions[2])

		const clearedParams: ReviewQueryParams = {
			sort: sortOptions[2].value,
			state: stateFilter?.value || '',
			country: countryFilter?.value || '',
			city: '',
			zip: '',
			search: '',
			limit: '25',
		}

		lastAppliedParams.current = clearedParams
		setQueryParams(clearedParams)
	}

	return (
		<>
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
							<Tab className='border-b-2 border-transparent px-1 pb-2 text-xl font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-selected:border-indigo-500 data-selected:text-indigo-600 md:text-3xl'>
								{t('reviews')}
							</Tab>
							<Tab className='border-b-2 border-transparent px-1 pb-2 text-xl font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-selected:border-indigo-500 data-selected:text-indigo-600 md:text-3xl'>
								<div className='flex flex-row gap-1'>
									<p>{t('map')}</p>
									<div className='flex h-full flex-col justify-start'>
										<span className='inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-teal-500/10 ring-inset'>
											{t('beta')}
										</span>
									</div>
								</div>
							</Tab>
							<Tab className='border-b-2 border-transparent px-1 pb-2 text-xl font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-selected:border-indigo-500 data-selected:text-indigo-600 md:text-3xl'>
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
										cityFilter={cityFilter}
										zipFilter={zipFilter}
										dynamicCityOptions={dynamicCityOptions}
										dynamicZipOptions={dynamicZipOptions}
										searchFilter={searchFilter || ''}
										onSearchChange={(value) => dispatch(updateSearch(value))}
										onCityChange={(value) => dispatch(updateCity(value))}
										onZipChange={(value) => dispatch(updateZip(value))}
										onApply={() => {
											handleApplyFilters('mobile')
											setMobileFiltersOpen(false)
										}}
										onClear={() => {
											handleClearFilters('mobile')
											setMobileFiltersOpen(false)
										}}
									/>

									<ReviewFilters
										selectedSort={selectedSort}
										setSelectedSort={setSelectedSort}
										sortOptions={sortOptions}
										cityFilter={cityFilter}
										zipFilter={zipFilter}
										dynamicCityOptions={dynamicCityOptions}
										dynamicZipOptions={dynamicZipOptions}
										searchFilter={searchFilter || ''}
										onSearchChange={(value) => dispatch(updateSearch(value))}
										onCityChange={(value) => dispatch(updateCity(value))}
										onZipChange={(value) => dispatch(updateZip(value))}
										onApply={() => handleApplyFilters('desktop')}
										onClear={() => handleClearFilters('desktop')}
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
										<ReviewTable data={reviews} isLoading={isLoadingHook} />
									)}
								</div>
							</TabPanel>

							<TabPanel>
								<MapComponent
									countryFilter={countryFilter}
									stateFilter={stateFilter}
								/>
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
