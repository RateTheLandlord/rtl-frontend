'use client'

import React, { useState, useEffect, type JSX } from 'react'
import Review from './Review'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useRouter } from '@/i18n/navigation'
import Hero from './components/Hero'
import { updateStateAndCountry } from '@/redux/query/querySlice'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import { getStates } from '@/util/countries/combineStates'
import AdsComponent, { AD_UNITS } from '../adsense/Adsense'

type ReviewRouteParams = {
	view?: string | string[]
	country?: string | string[]
	state?: string | string[]
	affiliate?: string | string[]
}

function ReviewForm({
	routeParams,
}: {
	routeParams: ReviewRouteParams
}): JSX.Element {
	const [locationOpen, setLocationOpen] = useState<boolean>(true)

	const router = useRouter()
	const { view, country, state, affiliate } = routeParams

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
				const isLocationValid = Boolean(countryFilter && stateFilter)

				if (
					countryFilter?.value !== foundCountry.value ||
					stateFilter?.value !== foundState.value
				) {
					dispatch(
						updateStateAndCountry({ country: foundCountry, state: foundState }),
					)
				}
				setLocationOpen(!isLocationValid)
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
			)
		}
	}, [stateFilter, countryFilter])

	return (
		<div className='m-2 w-full max-w-7xl'>
			<div className='w-full'>
				<AdsComponent slot={AD_UNITS.REVIEWS} />
			</div>
			{!locationOpen ? (
				<Review
					view={view}
					affiliate={affiliate}
					setLocationOpen={setLocationOpen}
				/>
			) : (
				<Hero countryFilter={countryFilter} stateFilter={stateFilter} />
			)}
		</div>
	)
}

export default ReviewForm
