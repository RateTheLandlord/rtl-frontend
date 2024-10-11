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
				Please enter the name of your Landlord or Property Management Company
				exactly as it appears on your Lease or Rental Agreement. This
				information is crucial, as it ensures that potential tenants can easily
				locate your property listing on our site. An accurate name not only
				helps maintain clarity but also builds trust within our community,
				allowing others to make informed decisions. <br />
				Please note that for privacy and security reasons, no addresses are
				allowed in this field. Taking a moment to double-check the spelling and
				format will go a long way in connecting your property with prospective
				renters. Thank you for your attention to detail!
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
