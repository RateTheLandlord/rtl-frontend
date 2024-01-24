import { fetchWithBody } from '@/util/helpers/fetcher'
import { sortOptions } from '@/util/helpers/filter-options'
import {
	Options,
	Resource,
	ResourceResponse,
} from '@/util/interfaces/interfaces'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { getCityOptions, getStateOptions } from '../reviews/functions'
import ReviewFilters from '../reviews/review-filters'
import InfiniteScroll from './InfiniteScrollResources'
import { useDebounce } from '@/util/hooks/useDebounce'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateResourceQuery } from '@/redux/resourceQuery/resourceQuerySlice'
import { ResourceQuery } from '@/lib/tenant-resource/resource'

const resourceSortOptions = sortOptions.filter((r) => r.id < 5)

export default function ResourceList() {
	const query = useAppSelector((state) => state.resourceQuery)
	const {
		countryFilter,
		stateFilter,
		cityFilter,
		zipFilter,
		activeFilters,
		searchFilter,
	} = query
	const dispatch = useAppDispatch()
	const [selectedSort, setSelectedSort] = useState<Options>(
		resourceSortOptions[2],
	)

	const [page, setPage] = useState<number>(1)
	const [hasMore, setHasMore] = useState(true) // Track if there is more content to load

	const [previousQueryParams, setPreviousQueryParams] = useState<
		ResourceQuery | undefined
	>()
	const [isLoading, setIsLoading] = useState(false)

	const debouncedSearch = useDebounce(searchFilter, 500)

	useEffect(() => {
		dispatch(updateResourceQuery({ ...query, searchFilter: debouncedSearch }))
	}, [debouncedSearch])

	const queryParams: ResourceQuery = useMemo(() => {
		const params: ResourceQuery = {
			page: page,
			sort: selectedSort.value as 'az' | 'za' | 'new' | 'old',
			state: stateFilter?.value || '',
			country: countryFilter?.value || '',
			city: cityFilter?.value || '',
			search: debouncedSearch || '',
			limit: '25',
		}
		return params
	}, [
		page,
		selectedSort,
		stateFilter,
		countryFilter,
		cityFilter,
		zipFilter,
		debouncedSearch,
	])
	const { data } = useSWR<ResourceResponse>(
		[`/api/tenant-resources/get-resources`, { queryParams }],
		fetchWithBody,
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
			if (cityFilter === activeFilters[index])
				dispatch(updateResourceQuery({ ...query, cityFilter: null }))
			if (stateFilter === activeFilters[index])
				dispatch(updateResourceQuery({ ...query, stateFilter: null }))
			if (countryFilter === activeFilters[index])
				dispatch(updateResourceQuery({ ...query, countryFilter: null }))
			if (zipFilter === activeFilters[index])
				dispatch(updateResourceQuery({ ...query, zipFilter: null }))
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
				sortOptions={resourceSortOptions}
				countryFilter={countryFilter}
				stateFilter={stateFilter}
				cityFilter={cityFilter}
				zipFilter={zipFilter}
				cityOptions={cityOptions}
				stateOptions={stateOptions}
				removeFilter={removeFilter}
				resource
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
