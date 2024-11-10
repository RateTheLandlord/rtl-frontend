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
				<p className='text-xs'>Landlord</p>
				<p className='text-md'>{landlord}</p>
			</div>
			<div>
				<Button
					onClick={() => {
						setLandlordOpen(true)
					}}
				>
					Edit
				</Button>
			</div>
		</div>
	) : (
		<>
			<div>
				<h2 className='text-base font-semibold leading-7 text-gray-900'>
					Landlord
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-600'>
					Enter the name of your landlord or property management company as it
					appears on your lease. Double-check the spelling before you submit so
					your review can be matched with other reviews for this landlord. Do
					not include the full address, all addresses will be removed.
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
					Continue
				</Button>
			</div>
		</>
	)
}

export default LandlordForm
