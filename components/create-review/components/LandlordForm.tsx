import LandlordComboBox from './LandlordComboBox'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateLandlord } from '@/redux/review/reviewSlice'

interface IProps {
	landlordValidationError: boolean
	landlordValidationText: string
}

const LandlordForm = ({
	landlordValidationError,
	landlordValidationText,
}: IProps) => {
	const t = useTranslations('createreview')

	const { landlord } = useAppSelector((state) => state.review)
	const dispatch = useAppDispatch()

	const {
		isSearching,
		landlordSuggestions,
	}: { isSearching: boolean; landlordSuggestions: string[] } =
		useLandlordSuggestions(landlord)
	return (
		<div data-testid='LandlordForm-component'>
			<div>
				<h2 className='text-primary-900 text-base leading-7 font-semibold'>
					{t('landlord-form.title')}
				</h2>
				<p className='text-primary-600 mt-1 text-sm leading-6'>
					{t('landlord-form.body')}
				</p>
			</div>
			<div className='grid w-full gap-3 py-2 sm:w-3/4 lg:w-1/2'>
				<LandlordComboBox
					name={t('review-form.landlord')}
					state={landlord}
					setState={(landlord) => dispatch(updateLandlord(landlord))}
					suggestions={landlordSuggestions}
					isSearching={isSearching}
					error={landlordValidationError}
					errorText={landlordValidationText}
				/>
			</div>
		</div>
	)
}

export default LandlordForm
