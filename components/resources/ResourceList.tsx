import { fetcher } from '@/util/helpers/fetcher'
import { sortOptions } from '@/util/helpers/filter-options'
import {
	Options,
	Resource,
	ResourceResponse,
} from '@/util/interfaces/interfaces'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import {
	getCityOptions,
	getStateOptions,
	updateActiveFilters,
} from '../reviews/functions'
import ReviewFilters from '../reviews/review-filters'
import InfiniteScroll from './InfiniteScrollResources'
import { useDebounce } from '@/util/hooks/useDebounce'

export default function ResourceList() {
	const [selectedSort, setSelectedSort] = useState<Options>(sortOptions[2])

	const [searchState, setSearchState] = useState<string>('')
	const [page, setPage] = useState<number>(1)

	const [countryFilter, setCountryFilter] = useState<Options | null>(null)
	const [stateFilter, setStateFilter] = useState<Options | null>(null)
	const [cityFilter, setCityFilter] = useState<Options | null>(null)
	const [zipFilter, setZipFilter] = useState<Options | null>(null)
	const [activeFilters, setActiveFilters] = useState<Options[] | null>(null)
	const [hasMore, setHasMore] = useState(true) // Track if there is more content to load

	const [previousQueryParams, setPreviousQueryParams] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const debouncedSearch = useDebounce(searchState, 500)

	const queryParams = useMemo(() => {
		const params = new URLSearchParams({
			sort: selectedSort.value,
			state: stateFilter?.value || '',
			country: countryFilter?.value || '',
			city: cityFilter?.value || '',
			zip: zipFilter?.value || '',
			search: debouncedSearch || '',
			limit: '25',
		})
		return params.toString()
	}, [
		selectedSort,
		stateFilter,
		countryFilter,
		cityFilter,
		zipFilter,
		debouncedSearch,
	])
	const { data } = useSWR<ResourceResponse>(
		`/api/tenant-resources/get-resources?page=${page}&${queryParams.toString()}`,
		fetcher,
	)

	const [resources, setResources] = useState<Resource[]>(data?.resources || [])

	useEffect(() => {
		if (queryParams !== previousQueryParams) {
			setResources(data?.resources || [])
			setIsLoading(false)
		} else if (data) {
			setResources((prevReviews) => [...prevReviews, ...data.resources])
			setIsLoading(false)
		}
		setPreviousQueryParams(queryParams)
	}, [data, queryParams, previousQueryParams])

	useEffect(() => {
		if (data) {
			if (resources.length >= Number(data?.total) || data.resources.length <= 0)
				setHasMore(false)
		}
	}, [resources, data])

	useEffect(() => {
		setActiveFilters(
			updateActiveFilters(countryFilter, stateFilter, cityFilter, zipFilter),
		)
		setPage(1)
	}, [
		cityFilter,
		stateFilter,
		countryFilter,
		zipFilter,
		debouncedSearch,
		selectedSort,
	])

	const cityOptions = useMemo(
		() => getCityOptions(data?.cities ?? []),
		[data?.cities],
	)
	const stateOptions = useMemo(
		() => getStateOptions(data?.states ?? []),
		[data?.states],
	)

	const removeFilter = (index: number) => {
		if (activeFilters?.length) {
			if (cityFilter === activeFilters[index]) setCityFilter(null)
			if (stateFilter === activeFilters[index]) setStateFilter(null)
			if (countryFilter === activeFilters[index]) setCountryFilter(null)
		}
	}
	return (
		<div className='w-full'>
			<ReviewFilters
				title='Find Resources'
				description='Search our ever expanding database for Tenant Resources in your area!'
				searchTitle='Search Resources'
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
				sortOptions={sortOptions}
				activeFilters={activeFilters}
				countryFilter={countryFilter}
				setCountryFilter={setCountryFilter}
				stateFilter={stateFilter}
				setStateFilter={setStateFilter}
				cityFilter={cityFilter}
				setCityFilter={setCityFilter}
				zipFilter={zipFilter}
				setZipFilter={setZipFilter}
				cityOptions={cityOptions}
				stateOptions={stateOptions}
				removeFilter={removeFilter}
				setSearchState={setSearchState}
			/>
			<div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
				{!resources.length ? (
					<div>No Resources Found</div>
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
	)
}
