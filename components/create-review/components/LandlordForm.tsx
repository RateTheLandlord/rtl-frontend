import LandlordComboBox from './LandlordComboBox'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'
import Button from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'

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
	const t = useTranslations('createreview')

	const {
		isSearching,
		landlordSuggestions,
	}: { isSearching: boolean; landlordSuggestions: string[] } =
		useLandlordSuggestions(landlord)
	return !landlordOpen && !landlordValidationError ? (
		<div className='flex w-full flex-row items-center justify-between transition-all duration-500'>
			<div className='flex flex-col gap-2'>
				<p className='text-xs'>{t('landlord-form.title')}</p>
				<p className='text-md'>{landlord}</p>
			</div>
			<div>
				<Button
					onClick={() => {
						setLandlordOpen(true)
					}}
				>
					{t('edit')}
				</Button>
			</div>
		</div>
	) : (
		<div data-testid='LandlordForm-component'>
			<div>
				<h2 className='text-base leading-7 font-semibold text-gray-900'>
					{t('landlord-form.title')}
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-600'>
					{t('landlord-form.body')}
				</p>
			</div>
			<LandlordComboBox
				name={t('review-form.landlord')}
				state={landlord}
				setState={setLandlordName}
				suggestions={landlordSuggestions}
				isSearching={isSearching}
				error={landlordValidationError}
				errorText={landlordValidationText}
			/>
			<div className='flex w-full justify-end pt-4'>
				<Button
					disabled={landlord === null || landlord.length === 0}
					onClick={() => {
						posthog.capture('create_review_landlord_name')
						setShowLocationForm(true)
						setLocationOpen(true)
						setLandlordOpen(false)
					}}
				>
					{t('continue')}
				</Button>
			</div>
		</div>
	)
}

export default LandlordForm
