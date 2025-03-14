import React from 'react'
import { Options } from '@/util/interfaces/interfaces'
import { useTranslations } from 'next-intl'
import ComboBox from '../ui/locationCombobox'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import { getStates } from '@/util/countries/combineStates'

interface LocationProps {
	selectedCountry: Options | null
	selectedState: Options | null
	setSelectedCountry: (opt: Options) => void
	setSelectedState: (opt: Options) => void
}

const LocationForm = ({
	selectedCountry,
	selectedState,
	setSelectedCountry,
	setSelectedState,
}: LocationProps) => {
	const t = useTranslations('reviews')

	return (
		<>
			<div className='flex flex-col items-center'>
				<div className='grid w-11/12'>
					<h2 className='border-b text-center text-lg leading-10 font-semibold text-gray-900 sm:text-lg md:text-xl lg:text-left lg:text-2xl xl:text-2xl'>
						{t('select_country')}
					</h2>
					<ComboBox
						testid='location-country-test'
						state={selectedCountry}
						setState={(opt: Options) => setSelectedCountry(opt)}
						options={countryOptions}
						name={t('country')}
					/>
				</div>
				<div className='py-4'></div>
				<div className='grid w-11/12 py-2'>
					{!selectedCountry ? null : (
						<>
							<h2 className='border-b text-center text-lg leading-10 font-semibold text-gray-900 sm:text-lg md:text-xl lg:text-left lg:text-2xl xl:text-2xl'>
								{t('select_state')}
							</h2>
							<ComboBox
								testid='location-state-test'
								state={selectedState}
								setState={(opt: Options) => setSelectedState(opt)}
								options={getStates(selectedCountry.value)}
								name={t('state')}
							/>
						</>
					)}
				</div>
			</div>
		</>
	)
}

export default LocationForm
