import React, { useEffect } from 'react'
import { Options } from '@/util/interfaces/interfaces'
import ComboBox from '../ui/combobox'
import SelectList from '../ui/select-list'
import { useTranslation } from 'react-i18next'
import { AppDispatch } from '@/redux/store'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import {
	clearFilters,
	updateCity,
	updateCountry,
	updateState,
	updateZip,
	updateActiveFilters
} from '@/redux/query/querySlice'


interface LocationProps {
	countryFilter: Options | null
	stateFilter: Options | null
	cityFilter: Options | null
	zipFilter: Options | null
	dynamicCityOptions: Options[]
	dynamicStateOptions: Options[]
	zipOptions: Options[]
	dynamicZipOptions: Options[]
	dispatch: AppDispatch
	fetchDynamicFilterOptions: () => Promise<void>
}

const LocationForm = ({
	countryFilter,
	stateFilter,
	cityFilter,
	zipFilter,
	dynamicCityOptions,
	dynamicStateOptions,
	zipOptions,
	dynamicZipOptions,
	dispatch,
	fetchDynamicFilterOptions }: LocationProps) => {
	const { t } = useTranslation('reviews')
	
	useEffect(() => {
		fetchDynamicFilterOptions()
	}, [stateFilter, cityFilter])

	useEffect(() => {
		dispatch(clearFilters())
		dispatch(updateCountry(countryFilter)),
		updateActiveFilters([countryFilter]),
		fetchDynamicFilterOptions()
	}, [countryFilter])

	useEffect(() => {
		dispatch(
			updateActiveFilters([stateFilter]),
		)
	}, [stateFilter])

	useEffect(() => {
		dispatch(
			updateActiveFilters([cityFilter]),
		)
	}, [cityFilter])

	useEffect(() => {
		dispatch(
			updateActiveFilters([zipFilter]),
		)
	}, [zipFilter])

	return (
		<>
			<h2 className='text-base font-semibold leading-7 text-gray-900'>
					Location
				</h2>
			<div className='grid w-full grid-cols-2 gap-5'>
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
