import ReviewFilters from '@/components/reviews/review-filters'
import { sortOptions } from '@/util/helpers/filter-options'
import { Options, Review } from '@/util/interfaces/interfaces'
import {
	getCityOptions,
	getStateOptions,
	getZipOptions,
} from '@/components/reviews/functions'
import React, { useEffect, useMemo, useState } from 'react'
import ReportModal from '@/components/reviews/report-modal'
import useSWR from 'swr'
import { fetchWithBody } from '@/util/helpers/fetcher'
import EditReviewModal from '../modal/EditReviewModal'
import RemoveReviewModal from '../modal/RemoveReviewModal'
import InfiniteScroll from './InfiniteScroll'
import AdsComponent from '@/components/adsense/Adsense'
import { useDebounce } from '@/util/hooks/useDebounce'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateQuery } from '@/redux/query/querySlice'

export type ReviewsResponse = {
	reviews: Review[]
	total: number
	countries: string[]
	states: string[]
	cities: string[]
	zips: string[]
	limit: number
}

export interface QueryParams {
	page: number
	sort: string
	state: string
	country: string
	city: string
	zip: string
	search: string
	limit: string
}

const Review = () => {
	const [page, setPage] = useState<number>(1)

	const [selectedSort, setSelectedSort] = useState<Options>(sortOptions[2])
	const query = useAppSelector((state) => state.query)
	const {
		countryFilter,
		stateFilter,
		cityFilter,
		zipFilter,
		activeFilters,
		searchFilter,
	} = query
	const dispatch = useAppDispatch()
	const [editReviewOpen, setEditReviewOpen] = useState(false)
	const [hasMore, setHasMore] = useState(true) // Track if there is more content to load

	const [reportOpen, setReportOpen] = useState<boolean>(false)
	const [removeReviewOpen, setRemoveReviewOpen] = useState(false)

	const [selectedReview, setSelectedReview] = useState<Review | undefined>()

	const [previousQueryParams, setPreviousQueryParams] = useState<
		QueryParams | undefined
	>()
	const [isLoading, setIsLoading] = useState(false)

	const debouncedSearchState = useDebounce(searchFilter, 500)

	useEffect(() => {
		dispatch(updateQuery({ ...query, searchFilter: debouncedSearchState }))
	}, [debouncedSearchState])

	const queryParams = useMemo(() => {
		const params = {
			page: page,
			sort: selectedSort.value,
			state: stateFilter?.value || '',
			country: countryFilter?.value || '',
			city: cityFilter?.value || '',
			zip: zipFilter?.value || '',
			search: debouncedSearchState || '',
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
		debouncedSearchState,
	])

	const { data } = useSWR<ReviewsResponse>(
		[`/api/review/get-reviews`, { queryParams }],
		fetchWithBody,
	)

	const [reviews, setReviews] = useState<Review[]>(data?.reviews || [])

	useEffect(() => {
		if (queryParams !== previousQueryParams) {
			setReviews(data?.reviews || [])
			setIsLoading(false)
		} else if (data) {
			setReviews((prevReviews) => [...prevReviews, ...data.reviews])
			setIsLoading(false)
		}
		setPreviousQueryParams(queryParams)
	}, [data, queryParams, previousQueryParams])

	useEffect(() => {
		if (data) {
			if (reviews.length >= data?.total || data.reviews.length <= 0)
				setHasMore(false)
		}
	}, [reviews, data])

	const cityOptions = useMemo(
		() => getCityOptions(data?.cities ?? []),
		[data?.cities],
	)
	const stateOptions = useMemo(
		() => getStateOptions(data?.states ?? []),
		[data?.states],
	)
	const zipOptions = useMemo(
		() => getZipOptions(data?.zips ?? []),
		[data?.zips],
	)

	const removeFilter = (index: number) => {
		if (activeFilters?.length) {
			if (cityFilter === activeFilters[index])
				dispatch(updateQuery({ ...query, cityFilter: null }))
			if (stateFilter === activeFilters[index])
				dispatch(updateQuery({ ...query, stateFilter: null }))
			if (countryFilter === activeFilters[index])
				dispatch(updateQuery({ ...query, countryFilter: null }))
			if (zipFilter === activeFilters[index])
				dispatch(updateQuery({ ...query, zipFilter: null }))
		}
	}

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
						mutateString={`/api/review/get-reviews?${queryParams.toString()}`}
						setEditReviewOpen={setEditReviewOpen}
						editReviewOpen={editReviewOpen}
						setSelectedReview={setSelectedReview}
					/>
					<RemoveReviewModal
						selectedReview={selectedReview}
						mutateString={`/api/review/get-reviews?${queryParams.toString()}`}
						setRemoveReviewOpen={setRemoveReviewOpen}
						removeReviewOpen={removeReviewOpen}
						setSelectedReview={setSelectedReview}
					/>
				</>
			) : null}
			<div className='w-full'>
				<AdsComponent slot='2009320000' />
				<ReviewFilters
					selectedSort={selectedSort}
					setSelectedSort={setSelectedSort}
					sortOptions={sortOptions}
					countryFilter={countryFilter}
					stateFilter={stateFilter}
					cityFilter={cityFilter}
					zipFilter={zipFilter}
					cityOptions={cityOptions}
					stateOptions={stateOptions}
					zipOptions={zipOptions}
					removeFilter={removeFilter}
				/>
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
			</div>
		</>
	)
}

export default Review
