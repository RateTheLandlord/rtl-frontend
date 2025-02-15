import { useTranslation } from 'next-i18next'
import { getStates } from '@/util/countries/combineStates'

interface IProps {
	country: string | undefined
	value: string
	setValue: (str: string) => void
	noState?: boolean
}

const StateSelector = ({ country, value, setValue, noState }: IProps) => {
	const { t } = useTranslation('createreview')
	return (
		<div className='mx-0.5 sm:col-span-1' data-testid='state-selector'>
			<label
				aria-label='state selector'
				htmlFor='state'
				className='block text-sm text-gray-700'
			>
				{country === 'GB'
					? t('create-review.review-form.region')
					: country === 'IE'
						? t('create-review.review-form.county')
						: t('create-review.review-form.state')}
			</label>
			<div className='mt-1'>
				<select
					data-testid='StateSelector-component'
					id='state'
					name='state'
					required
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className='block w-full cursor-pointer rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
				>
					{getStates(country).map((province) => (
						<option key={province.value} value={province.value}>
							{province.name}
						</option>
					))}
					{noState && (
						<option
							className='cursor-pointer p-2 hover:bg-teal-300'
							value='NO STATE / PROVINCE'
						>
							No State / Province
						</option>
					)}
				</select>
			</div>
		</div>
	)
}

export default StateSelector
