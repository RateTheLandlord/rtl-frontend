import { useTranslation } from 'next-i18next'
import { country_codes } from '@/util/helpers/getCountryCodes'
import countries from '@/util/countries/countries.json'

interface IProps {
	setValue: (str: string) => void
}

const CountrySelector = ({ setValue }: IProps) => {
	const { t } = useTranslation('createreview')
	return (
		<div className='mx-0.5 sm:col-span-1'>
			<label htmlFor='country' className='block text-sm text-gray-700'>
				{t('create-review.review-form.country')}
			</label>
			<div className='mt-1'>
				<select
					data-testid='country-selector'
					id='country'
					name='country'
					required
					onChange={(e) => setValue(e.target.value)}
					className='block w-full cursor-pointer rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
				>
					{country_codes.map((country) => {
						return (
							<option className='cursor-pointer' key={country} value={country}>
								{countries[country]}
							</option>
						)
					})}
				</select>
			</div>
		</div>
	)
}

export default CountrySelector
