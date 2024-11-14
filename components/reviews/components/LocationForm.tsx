import React, { useEffect, useState, useMemo } from 'react'
import { Options } from '@/util/interfaces/interfaces'
import ComboBox from '../ui/combobox'
import SelectList from '../ui/select-list'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import { getCityOptions, getStateOptions, getZipOptions } from '../functions'
import { Review as IReview } from '@/util/interfaces/interfaces'
import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'
import {
	clearFilters,
	updateCity,
	updateCountry,
	updateState,
	updateZip,
	updateActiveFilters
} from '@/redux/query/querySlice'

export type ReviewsResponse = {
	reviews: IReview[]
	total: number
	countries: string[]
	states: string[]
	cities: string[]
	zips: string[]
	limit: number
}

const LocationForm = ({ data }: { data: ReviewsResponse }) => {
	const { t } = useTranslation('reviews')
	// Redux
	const query = useAppSelector((state) => state.query)
	const { countryFilter, stateFilter, cityFilter, zipFilter } =
		query
	console.log("location " + stateFilter?.value)
	const dispatch = useAppDispatch()

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
		}
	}

	useEffect(() => {
		fetchDynamicFilterOptions()
	}, [stateFilter, cityFilter])

	useEffect(() => {
		dispatch(clearFilters())
		dispatch(updateCountry(countryFilter))
		fetchDynamicFilterOptions()
	}, [countryFilter])

	useEffect(() => {
		dispatch(
			updateActiveFilters([stateFilter, countryFilter, cityFilter, zipFilter]),
		)
	}, [stateFilter, cityFilter, countryFilter, zipFilter])

	return (
		<>
			<div>
				<h2 className='text-base font-semibold leading-7 text-gray-900'>
					Location
				</h2>
			</div>
			<div className='grid w-full grid-cols-2 gap-3 overflow-hidden'>
				<div className='py-2'>
					<SelectList
						state={countryFilter}
						setState={(opt: Options) => dispatch(updateCountry(opt))}
						options={countryOptions}
						name={t('reviews.country')}
					/>
				</div>
				<div className='py-2'>
					<ComboBox
						state={stateFilter}
						setState={(opt: Options) => dispatch(updateState(opt))}
						options={dynamicStateOptions}
						name={t('reviews.state')}
					/>
				</div>
				<div className='py-2'>
					<ComboBox
						state={cityFilter}
						setState={(opt: Options) => dispatch(updateCity(opt))}
						options={dynamicCityOptions}
						name={t('reviews.city')}
					/>
				</div>
				<div className='py-2'>
					{zipOptions && (
						<ComboBox
							state={zipFilter}
							setState={(opt: Options) => dispatch(updateZip(opt))}
							options={dynamicZipOptions}
							name={t('reviews.zip')}
						/>
					)}
				</div>
			</div>
		</>
	)
}

export default LocationForm
