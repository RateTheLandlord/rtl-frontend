import Button from '@/components/ui/button'
import StateSelector from '@/components/ui/StateSelector'
import TextInput from '@/components/ui/TextInput'
import CityComboBox from './CityComboBox'
import CountrySelector from '@/components/ui/CountrySelector'
import { ILocationHookResponse } from '@/util/interfaces/interfaces'
import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Country } from '@/types/review.types'
import { updatePostal, updateRent } from '@/redux/review/reviewSlice'

interface IProps {
	locationOpen: boolean
	postalError: boolean | undefined
	locations: ILocationHookResponse[]
	searching: boolean
	cityValidationError: boolean
	cityValidationErrorText: string
	setShowRatingForm: (bool: boolean) => void
	setRatingsOpen: (bool: boolean) => void
	setLocationOpen: (bool: boolean) => void
}

const LocationForm = ({
	locationOpen,
	setLocationOpen,
	locations,
	cityValidationError,
	cityValidationErrorText,
	searching,
	postalError,
	setRatingsOpen,
	setShowRatingForm,
}: IProps) => {
	const t = useTranslations('createreview')
	const { country, city, province, postal, rent } = useAppSelector(
		(state) => state.review,
	)
	const dispatch = useAppDispatch()
	const isIreland = country === Country.IE
	return !locationOpen ? (
		<div className='flex w-full flex-row items-center justify-between transition-all duration-500'>
			<div className='flex flex-col gap-2'>
				<p className='text-xs'>{t('location-form.title')}</p>
				<p className='text-md'>{`${city}, ${province}, ${country}${
					isIreland ? '' : `, ${postal}`
				}${rent ? ` - $${rent}` : ''}`}</p>
			</div>
			<div>
				<Button
					onClick={() => {
						setLocationOpen(true)
					}}
				>
					{t('edit')}
				</Button>
			</div>
		</div>
	) : (
		<div data-testid='LocationForm-component'>
			<div>
				<h2 className='text-base leading-7 font-semibold text-gray-900'>
					{t('location-form.title')}
				</h2>
			</div>
			<div className='grid-col-1 grid w-full gap-3 overflow-hidden py-2 lg:grid-cols-2'>
				<CountrySelector />

				<CityComboBox
					name={t('review-form.city')}
					options={locations}
					searching={searching}
					error={cityValidationError}
					errorText={cityValidationErrorText}
				/>

				<StateSelector />
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
					/>
				)}
				<TextInput
					id='rent'
					data-testid='rent-textinput'
					type='number'
					title={t('review-form.rent')}
					placeHolder={t('review-form.rent')}
					value={rent}
					setValue={(str: string) => dispatch(updateRent(Number(str)))}
					testid='create-review-form-rent-1'
				/>
			</div>
			<div className='flex w-full justify-end'>
				<Button
					disabled={
						isIreland
							? city === null || city.length === 0
							: city === null || city.length === 0 || postal.length === 0
					}
					onClick={() => {
						posthog.capture('create_review_location')
						setShowRatingForm(true)
						setLocationOpen(false)
						setRatingsOpen(true)
					}}
				>
					{t('continue')}
				</Button>
			</div>
		</div>
	)
}

export default LocationForm
