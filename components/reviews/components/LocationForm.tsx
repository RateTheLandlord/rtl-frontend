import React, { useEffect } from 'react'
import { Options } from '@/util/interfaces/interfaces'
import { useTranslation } from 'react-i18next'
import SelectList from '../ui/locationSelect-list'
import ComboBox from '../ui/locationCombobox'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import AdsComponent from '@/components/adsense/Adsense'
import {
	clearFilters,
	updateCountry,
	updateState,
	updateActiveFilters,
} from '@/redux/query/querySlice'
import { useAppDispatch } from '@/redux/hooks'

interface LocationProps {
	countryFilter: Options | null
	stateFilter: Options | null
	dynamicStateOptions: Options[]
	fetchDynamicFilterOptions: () => Promise<void>
}

const LocationForm = ({
	countryFilter,
	stateFilter,
	dynamicStateOptions,
	fetchDynamicFilterOptions,
}: LocationProps) => {
	const { t } = useTranslation('reviews')

	const dispatch = useAppDispatch()

	useEffect(() => {
		fetchDynamicFilterOptions()
	}, [stateFilter])

	useEffect(() => {
		dispatch(clearFilters())
		dispatch(updateCountry(countryFilter)),
			updateActiveFilters([countryFilter]),
			fetchDynamicFilterOptions()
	}, [countryFilter])

	useEffect(() => {
		dispatch(updateActiveFilters([stateFilter]))
	}, [stateFilter])

	return (
		<>
			<div className='flex flex-col items-center '>
				<div className='grid w-11/12'>
					<h2 className='border-b text-lg font-semibold leading-10 text-gray-900 sm:text-lg md:text-xl lg:text-2xl xl:text-2xl'>
						Please Select a Country
					</h2>
					<SelectList
						state={countryFilter}
						setState={(opt: Options) => dispatch(updateCountry(opt))}
						options={countryOptions}
						name={t('reviews.country')}
					/>
				</div>
				<div className='py-4'></div>
				<div className='grid w-11/12 animate-fade-in py-2'>
					{!countryFilter ? null : (
						<>
							<h2 className='border-b text-lg font-semibold leading-10 text-gray-900 sm:text-lg md:text-xl lg:text-2xl xl:text-2xl '>
								Please Select a State/Province
							</h2>
							<ComboBox
								state={stateFilter}
								setState={(opt: Options) => dispatch(updateState(opt))}
								options={dynamicStateOptions}
								name={t('reviews.state')}
							/>
						</>
					)}
				</div>
			</div>
			<div className='w-full'>
				<AdsComponent slot='2009320000' />
			</div>
		</>
	)
}

export default LocationForm
