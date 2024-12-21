/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, useEffect } from 'react'
import { Review as IReview } from '@/util/interfaces/interfaces'
import Review from './review'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/router'
import Hero from './components/Hero'
import { updateStateAndCountry } from '@/redux/query/querySlice'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import { getStates } from '@/util/countries/combineStates'

export type ReviewsResponse = {
	reviews: IReview[]
	total: number
	countries: string[]
	cities: string[]
	zips: string[]
	limit: number
}

function ReviewForm(): JSX.Element {
	const [locationOpen, setLocationOpen] = useState<boolean>(true)
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()
	const { view, country, state } = router.query

	// Redux
	const query = useAppSelector((state) => state.query)
	const { countryFilter, stateFilter } = query

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (view === 'map') {
			setLocationOpen(false)
			return // Exit early if the view is 'map'
		}

		if (country && state) {
			const foundCountry = countryOptions.find(
				(option) => option.value === decodeURIComponent(country as string),
			)
			const foundState = getStates(foundCountry?.value).find(
				(option) => option.value === decodeURIComponent(state as string),
			)

			if (foundCountry && foundState) {
				dispatch(
					updateStateAndCountry({ country: foundCountry, state: foundState }),
				)
				const isLocationValid = Boolean(countryFilter && stateFilter)
				setLocationOpen(isLocationValid)
			}
		}
	}, [view, country, state])

	useEffect(() => {
		if (countryFilter && stateFilter) {
			setLocationOpen(false)
			router.push(
				`/reviews?country=${encodeURIComponent(
					countryFilter.value,
				)}&state=${encodeURIComponent(stateFilter.value)}`,
				undefined,
				{ shallow: true },
			)
		}
	}, [stateFilter, countryFilter])

	return !locationOpen ? (
		<Review
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			view={view}
			setLocationOpen={setLocationOpen}
		/>
	) : (
		<Hero countryFilter={countryFilter} stateFilter={stateFilter} />
	)
}

export default ReviewForm
