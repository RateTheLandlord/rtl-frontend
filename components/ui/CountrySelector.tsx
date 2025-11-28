import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Country } from '@/types/review.types'
import { updateCountry } from '@/redux/review/reviewSlice'
import { updateCountry as updateResourceCountry } from '@/redux/resource/resourceSlice'

import countries from '@/util/countries/countries.json'

const CountrySelector = ({ isResource }: { isResource?: boolean }) => {
	const dispatch = useAppDispatch()
	const country = useAppSelector((state) =>
		isResource ? state.resource.country_code : state.review.country,
	)
	const t = useTranslations('createreview')
	return (
		<div className='mx-0.5 sm:col-span-1'>
			<label htmlFor='country' className='block text-sm text-gray-700'>
				{t('review-form.country')}
			</label>
			<div className='mt-1'>
				<select
					data-testid='country-selector'
					id='country'
					name='country'
					required
					value={country}
					onChange={(e) =>
						isResource
							? dispatch(
									updateResourceCountry(
										Country[e.target.value as keyof typeof Country],
									),
								)
							: dispatch(
									updateCountry(
										Country[e.target.value as keyof typeof Country],
									),
								)
					}
					className='block w-full cursor-pointer rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
				>
					{Object.keys(Country).map((country) => (
						<option className='cursor-pointer' key={country} value={country}>
							{countries[country as keyof typeof countries]}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}

export default CountrySelector
