import StateSelector from '@/components/ui/StateSelector'
import TextInput from '@/components/ui/TextInput'
import CityComboBox from './CityComboBox'
import CountrySelector from '@/components/ui/CountrySelector'
import { ILocationHookResponse } from '@/util/interfaces/interfaces'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Country } from '@/types/review.types'
import { updatePostal } from '@/redux/review/reviewSlice'

interface IProps {
	postalError: boolean | undefined
	locations: ILocationHookResponse[]
	searching: boolean
	cityValidationError: boolean
	cityValidationErrorText: string
}

const LocationForm = ({
	locations,
	cityValidationError,
	cityValidationErrorText,
	searching,
	postalError,
}: IProps) => {
	const t = useTranslations('createreview')
	const { country, postal } = useAppSelector((state) => state.review)
	const dispatch = useAppDispatch()
	const isIreland = country === Country.IE

	return (
		<div data-testid='LocationForm-component'>
			<div className='grid grid-cols-1 gap-3 py-2 sm:w-full lg:grid-cols-2'>
				<CountrySelector />
				<StateSelector />
				<CityComboBox
					name={t('review-form.city')}
					options={locations}
					searching={searching}
					error={cityValidationError}
					errorText={cityValidationErrorText}
				/>
				{isIreland ? null : (
					<TextInput
						id='postal-code'
						title={t('review-form.zip')}
						placeHolder={t('review-form.zip')}
						value={postal}
						setValue={(str: string) => dispatch(updatePostal(str))}
						error={postalError}
						errorText={t('review-form.postal-error')}
						testid='create-review-form-postal-code-1'
						backgroundColor='white'
					/>
				)}
			</div>
		</div>
	)
}

export default LocationForm
