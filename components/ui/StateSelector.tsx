import { useTranslations } from 'next-intl'
import { getStates } from '@/util/countries/combineStates'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Country } from '@/types/review.types'
import { updateProvince } from '@/redux/review/reviewSlice'

interface IProps {
	noState?: boolean
}

const StateSelector = ({ noState }: IProps) => {
	const { country, province } = useAppSelector((state) => state.review)
	const dispatch = useAppDispatch()
	const t = useTranslations('createreview')
	return (
		<div className='mx-0.5 sm:col-span-1' data-testid='state-selector'>
			<label
				aria-label='state selector'
				htmlFor='state'
				className='block text-sm text-gray-700'
			>
				{country === Country.GB
					? t('review-form.region')
					: country === Country.IE
						? t('review-form.country')
						: t('review-form.state')}
			</label>
			<div className='mt-1'>
				<select
					data-testid='StateSelector-component'
					id='state'
					name='state'
					required
					value={province}
					onChange={(e) => dispatch(updateProvince(e.target.value))}
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
