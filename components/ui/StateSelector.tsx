import { useTranslation } from 'react-i18next'
import provinces from '@/util/countries/canada/provinces.json'
import regions from '@/util/countries/unitedKingdom/regions.json'
import states from '@/util/countries/unitedStates/states.json'
import territories from '@/util/countries/australia/territories.json'
import nz_provinces from '@/util/countries/newZealand/nz-provinces.json'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
	country: string | undefined
	setValue: Dispatch<SetStateAction<string>>
}

const StateSelector = ({ country, setValue }: IProps) => {
	const { t } = useTranslation('create')
	return (
		<div data-testid="state-selector" className='sm:col-span-2'>
			<label
				htmlFor='region'
				className='block text-sm font-medium text-gray-700'
			>
				{country === 'GB'
					? t('create-review.review-form.region')
					: t('create-review.review-form.state')}
			</label>
			<div className='mt-1'>
				<select
					id='region'
					name='region'
					required
					onChange={(e) => setValue(e.target.value)}
					className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
				>
					{country === 'CA'
						? provinces.map((province) => {
								return (
									<option key={province.short} value={province.name}>
										{province.name}
									</option>
								)
						  })
						: country === 'GB'
						? regions.map((region) => {
								return (
									<option key={region.short} value={region.name}>
										{region.name}
									</option>
								)
						  })
						: country === 'AU'
						? territories.map((territory) => {
								return (
									<option key={territory.short} value={territory.name}>
										{territory.name}
									</option>
								)
						  })
						: country === 'NZ'
						? nz_provinces.map((prov) => {
								return (
									<option key={prov.short} value={prov.name}>
										{prov.name}
									</option>
								)
						  })
						: states.map((state) => {
								return (
									<option key={state.short} value={state.name}>
										{state.name}
									</option>
								)
						  })}
				</select>
			</div>
		</div>
	)
}

export default StateSelector
