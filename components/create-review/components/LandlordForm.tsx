import LandlordComboBox from './LandlordComboBox'
import { useTranslation } from 'react-i18next'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'
import Button from '@/components/ui/button'

interface IProps {
	landlordOpen: boolean
	setLandlordOpen: (bool: boolean) => void
	landlord: string
	setLandlordName: (str: string) => void
	setShowLocationForm: (bool: boolean) => void
	setLocationOpen: (bool: boolean) => void
	landlordValidationError: boolean
	landlordValidationText: string
}

const LandlordForm = ({
	landlordOpen,
	setLandlordOpen,
	landlord,
	setLandlordName,
	setShowLocationForm,
	setLocationOpen,
	landlordValidationError,
	landlordValidationText,
}: IProps) => {
	const { t } = useTranslation('create')

	const {
		isSearching,
		landlordSuggestions,
	}: { isSearching: boolean; landlordSuggestions: Array<string> } =
		useLandlordSuggestions(landlord)
	return !landlordOpen && !landlordValidationError ? (
		<div className='flex w-full flex-row items-center justify-between transition-all duration-500'>
			<div className='flex flex-col gap-2'>
				<p className='text-xs'>{t('create-review.landlord-form.title')}</p>
				<p className='text-md'>{landlord}</p>
			</div>
			<div>
				<Button
					onClick={() => {
						setLandlordOpen(true)
					}}
				>
					{t('create-review.edit')}
				</Button>
			</div>
		</div>
	) : (
		<>
			<div>
				<h2 className='text-base font-semibold leading-7 text-gray-900'>
					{t('create-review.landlord-form.title')}
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-600'>
					{t('create-review.landlord-form.body')}
				</p>
			</div>
			<LandlordComboBox
				name={t('create-review.review-form.landlord')}
				state={landlord}
				setState={setLandlordName}
				suggestions={landlordSuggestions}
				isSearching={isSearching}
				error={landlordValidationError}
				errorText={landlordValidationText}
			/>
			<div className='flex w-full justify-end'>
				<Button
					disabled={landlord === null || landlord.length === 0}
					onClick={() => {
						setShowLocationForm(true)
						setLocationOpen(true)
						setLandlordOpen(false)
					}}
				>
					{t('create-review.continue')}
				</Button>
			</div>
		</>
	)
}

export default LandlordForm
