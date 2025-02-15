import React, { useState, useEffect } from 'react'
import Review from './review'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/router'
import Hero from './components/Hero'
import { updateStateAndCountry } from '@/redux/query/querySlice'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import { getStates } from '@/util/countries/combineStates'
import AdsComponent from '../adsense/Adsense'

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
				const isLocationValid = Boolean(countryFilter && stateFilter)
				if (
					countryFilter?.value !== foundCountry.value ||
					stateFilter?.value !== foundState.value
				) {
					dispatch(
						updateStateAndCountry({ country: foundCountry, state: foundState }),
					)
				}
				setLocationOpen(isLocationValid)
			}
		}
	}, [view, country, state, countryFilter, stateFilter, dispatch])

	useEffect(() => {
		if (countryFilter && stateFilter) {
			setLocationOpen(false)
			void router.push(
				`/reviews?country=${encodeURIComponent(
					countryFilter.value,
				)}&state=${encodeURIComponent(stateFilter.value)}`,
				undefined,
				{ shallow: true },
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateFilter, countryFilter])

	return (
		<div className='m-2 w-full max-w-7xl'>
			<div className='w-full'>
				<AdsComponent slot='2009320000' />
			</div>
			{!locationOpen ? (
				<Review
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					view={view}
					setLocationOpen={setLocationOpen}
				/>
			) : (
				<Hero countryFilter={countryFilter} stateFilter={stateFilter} />
			)}
		</div>
	)
}

export default ReviewForm
