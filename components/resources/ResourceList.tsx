import { sortOptions } from '@/util/helpers/filter-options'
import {
	Resource,
	ResourceResponse,
	SortOptions,
} from '@/util/interfaces/interfaces'
import { useEffect, useMemo, useState } from 'react'
import { getCityOptions, getStateOptions } from '../reviews/functions'
import InfiniteScroll from './InfiniteScrollResources'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import ResourceFilters from './resource-filters'
import { updateResourceActiveFilters } from '@/redux/resourceQuery/resourceQuerySlice'
import { fetchResources } from '@/util/helpers/fetchReviews'
import ResourceMobileFilters from './resource-mobile-filters'
import ButtonLight from '../ui/button-light'
import { useTranslation } from 'react-i18next'

const resourceSortOptions: Array<SortOptions> = sortOptions.filter(
	(r) => r.id < 5,
)

export default function ResourceList({ data }: { data: ResourceResponse }) {
	// Localization
	const { t } = useTranslation('reviews')

	// Redux
	const query = useAppSelector((state) => state.resourceQuery)
	const { countryFilter, stateFilter, cityFilter, searchFilter } = query
	const dispatch = useAppDispatch()
	const [selectedSort, setSelectedSort] = useState<SortOptions>(
		resourceSortOptions[2],
	)

	// State
	const [page, setPage] = useState<number>(1)
	const [hasMore, setHasMore] = useState(true) // Track if there is more content to load
	const [isLoading, setIsLoading] = useState(false)
	const [resources, setResources] = useState<Resource[]>(data?.resources || [])
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false)

	// Query
	const [queryParams, setQueryParams] = useState({
		sort: selectedSort.value,
		state: '',
		country: '',
		city: '',
		search: '',
		limit: '25',
	})

	// Filtering and Infinite Loading
	const updateParams = () => {
		const params = {
			sort: selectedSort.value,
			state: stateFilter?.value || '',
			country: countryFilter?.value || '',
			city: cityFilter?.value || '',
			search: searchFilter || '',
			limit: '25',
		}
		dispatch(
			updateResourceActiveFilters([stateFilter, countryFilter, cityFilter]),
		)
		setPage(1)
		setQueryParams(params)
	}

	const fetchData = async () => {
		setIsLoading(true)
		try {
			const moreData = await fetchResources({ page, ...queryParams })

			setResources((prevReviews) => {
				if (page === 1) {
					// Initial fetch
					return [...moreData.resources]
				} else {
					// If page changed or neither page nor other query parameters changed, append new reviews
					return [...prevReviews, ...moreData.resources]
				}
			})

			if (
				moreData.resources.length <= 0 ||
				resources.length >= Number(moreData.total)
			) {
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

	// Filtering Options
	const cityOptions = useMemo(
		() => getCityOptions(data?.cities ?? []),
		[data?.cities],
	)
	const stateOptions = useMemo(
		() => getStateOptions(data?.states ?? []),
		[data?.states],
	)

	return (
		<div className='w-full'>
			<div className='mx-auto max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8'>
				<div className='flex w-full justify-end px-4 lg:hidden'>
					<ButtonLight
						onClick={() => setMobileFiltersOpen(true)}
						umami='Reviews / Review Filters'
					>
						{t('reviews.filters')}
					</ButtonLight>
				</div>
				<div className='mx-auto max-w-2xl lg:max-w-7xl'>
					<div className='flex lg:flex-row lg:gap-2 lg:divide-x lg:divide-gray-200'>
						<ResourceMobileFilters
							mobileFiltersOpen={mobileFiltersOpen}
							setMobileFiltersOpen={setMobileFiltersOpen}
							countryFilter={countryFilter}
							stateFilter={stateFilter}
							stateOptions={stateOptions}
							cityFilter={cityFilter}
							cityOptions={cityOptions}
							updateParams={updateParams}
						/>
						<ResourceFilters
							searchTitle='Search Resources'
							selectedSort={selectedSort}
							setSelectedSort={setSelectedSort}
							sortOptions={resourceSortOptions}
							countryFilter={countryFilter}
							stateFilter={stateFilter}
							cityFilter={cityFilter}
							cityOptions={cityOptions}
							stateOptions={stateOptions}
							resource
							loading={isLoading}
							updateParams={updateParams}
						/>

						{!resources.length ? (
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
								data={resources}
								setPage={setPage}
								hasMore={hasMore}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
