/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, useMemo, useEffect } from 'react'
import { Options } from '@/util/interfaces/interfaces'
import { debounce } from 'lodash'
import { Review as IReview } from '@/util/interfaces/interfaces'
import Review from './review'
import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCityOptions, getStateOptions, getZipOptions } from './functions'
import { useRouter } from 'next/router'
import Hero from './components/Hero'

export type ReviewsResponse = {
	reviews: IReview[]
	total: number
	countries: string[]
	states: string[]
	cities: string[]
	zips: string[]
	limit: number
}

function ReviewForm({ data }: { data: ReviewsResponse }): JSX.Element {
	const [locationOpen, setLocationOpen] = useState<boolean>(true)
	const [loading, setLoading] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()
	const { view } = router.query

	useEffect(() => {
		if (view && view === 'map') {
			setLocationOpen(false)
		}
	}, [view])
	// Redux
	const query = useAppSelector((state) => state.query)
	const { countryFilter, stateFilter, cityFilter, zipFilter, searchFilter } =
		query

	const dispatch = useAppDispatch()

	const handleSubmit = async () => {
		setLoading(true)
		setLocationOpen(false)
	}

	useEffect(() => {
		if (!countryFilter) setLoading(false)
	}, [countryFilter])

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
	const [dynamicZipOptions, setDynamicZipOptions] = useState<Options[]>(
		zipOptions ?? [],
	)

	const fetchDynamicFilterOptions = debounce(async () => {
		setIsLoading(true)
		try {
			const filterOptions = await fetchFilterOptions(
				countryFilter?.value,
				stateFilter?.value,
				cityFilter?.value,
				zipFilter?.value,
			)
			setDynamicCityOptions(filterOptions.cities)
			setDynamicStateOptions(filterOptions.states)
			setDynamicZipOptions(filterOptions.zips)
		} catch (error) {
			console.error('Error fetching filter options:', error)
		} finally {
			setIsLoading(false)
		}
	}, 300)

	return !locationOpen ? (
		<Review
			data={data}
			query={query}
			searchFilter={searchFilter}
			countryFilter={countryFilter}
			stateFilter={stateFilter}
			cityFilter={cityFilter}
			zipFilter={zipFilter}
			dynamicCityOptions={dynamicCityOptions}
			dynamicZipOptions={dynamicZipOptions}
			dispatch={dispatch}
			fetchDynamicFilterOptions={fetchDynamicFilterOptions}
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			view={view}
			setLocationOpen={setLocationOpen}
		/>
	) : (
		<Hero
			loading={loading}
			countryFilter={countryFilter}
			stateFilter={stateFilter}
			dynamicStateOptions={dynamicStateOptions}
			fetchDynamicFilterOptions={fetchDynamicFilterOptions}
			handleSubmit={handleSubmit}
		/>
	)
}

export default ReviewForm
