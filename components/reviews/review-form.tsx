/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, useMemo } from 'react'
import Button from '../ui/button'
import Spinner from '../ui/Spinner'
import LocationForm from './components/LocationForm'
import ReviewHero from './components/ReviewHero'
import { Options } from '@/util/interfaces/interfaces'
import { Review as IReview } from '@/util/interfaces/interfaces'
import Review from './review'
import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCityOptions, getStateOptions, getZipOptions } from './functions'

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

	// Redux
	const query = useAppSelector((state) => state.query)
	const { countryFilter, stateFilter, cityFilter, zipFilter, searchFilter } =
		query

	const dispatch = useAppDispatch()

	const handleSubmit = async () => {
		setLoading(true)
		setLocationOpen(false)
		setLoading(true)
	}

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

	const fetchDynamicFilterOptions = async () => {
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
	}

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
			dynamicStateOptions={dynamicStateOptions}
			dynamicZipOptions={dynamicZipOptions}
			dispatch={dispatch}
			fetchDynamicFilterOptions={fetchDynamicFilterOptions}
			isLoading={isLoading}
			setIsLoading={setIsLoading}
		/>
	) : (
		<div className='min-h-screen min-w-screen relative flex flex-col items-center rounded-3xl bg-gray-100 '>
			<div className='mt-8 gap-2 p-10'>
				<ReviewHero></ReviewHero>
				<div className='w-full p-14 transition-all duration-500'>
					<LocationForm
						countryFilter={countryFilter}
						stateFilter={stateFilter}
						dynamicStateOptions={dynamicStateOptions}
						dispatch={dispatch}
						fetchDynamicFilterOptions={fetchDynamicFilterOptions}
					/>
				</div>
			</div>
			<div className='absolute bottom-10 sm:bottom-16 md:bottom-20 lg:bottom-20'>
				{loading ? (
					<Spinner />
				) : (
					<Button
						disabled={!countryFilter || !stateFilter}
						onClick={() => handleSubmit()}
						size='large'
					>
						Continue
					</Button>
				)}
			</div>
		</div>	
	)
}

export default ReviewForm
