import ReviewFilters from '@/components/reviews/review-filters'
import { sortOptions } from '@/util/helpers/filter-options'
import { Review as IReview, SortOptions } from '@/util/interfaces/interfaces'
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
import MobileReviewFilters from './mobile-review-filters'
import { useTranslation } from 'react-i18next'
import ButtonLight from '../ui/button-light'

export type ReviewsResponse = {
	reviews: IReview[]
	total: number
	countries: string[]
	states: string[]
	cities: string[]
	zips: string[]
	limit: number
}

export interface QueryParams {
	page: number
	sort: 'az' | 'za' | 'new' | 'old' | 'high' | 'low' | undefined
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

	// Query
	const [queryParams, setQueryParams] = useState({
		sort: selectedSort.value,
		state: '',
		country: '',
		city: '',
		zip: '',
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

	// Filtering Options
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
					<div className='flex lg:flex-row lg:gap-2 lg:divide-x lg:divide-gray-200'>
						<MobileReviewFilters
							mobileFiltersOpen={mobileFiltersOpen}
							setMobileFiltersOpen={setMobileFiltersOpen}
							countryFilter={countryFilter}
							stateFilter={stateFilter}
							stateOptions={stateOptions}
							cityFilter={cityFilter}
							cityOptions={cityOptions}
							zipFilter={zipFilter}
							zipOptions={zipOptions}
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
							cityOptions={cityOptions}
							stateOptions={stateOptions}
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

export default Review
