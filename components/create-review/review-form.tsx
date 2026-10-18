import { ReviewResponseStatus } from '@/lib/review/types/Responses'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updatePostal, updateProvince } from '@/redux/review/reviewSlice'
import { Country } from '@/types/review.types'
import { classNames } from '@/util/helpers/helper-functions'
import { useLocation } from '@/util/hooks/useLocation'
import { ILocationHookResponse } from '@/util/interfaces/interfaces'
import { useTranslations } from 'next-intl'
import { useReCaptcha } from 'next-recaptcha-v3'
import { postcodeValidator } from 'postcode-validator'
import posthog from 'posthog-js'
import { useEffect, useState, type JSX } from 'react'
import { toast } from 'react-toastify'
import { useModal } from '../modal/ModalContext'
import Button from '../ui/button'
import Spinner from '../ui/Spinner'
import LocationForm from './components/CreateReviewLocationForm'
import LandlordForm from './components/LandlordForm'
import RatingForm from './components/RatingForm'
import WrittenReviewForm from './components/WrittenReviewForm'

function ReviewForm(): JSX.Element {
	const t = useTranslations()

	const {
		landlord,
		country,
		city,
		province,
		postal,
		rent,
		repair,
		health,
		stability,
		privacy,
		respect,
		review,
	} = useAppSelector((state) => state.review)
	const { openModal } = useModal()
	const { userKey } = useAppSelector((state) => state.modal)
	const dispatch = useAppDispatch()

	const [reviewId, setReviewId] = useState<number | null>(null)

	const isIreland = country === Country.IE

	const {
		searching,
		locations,
	}: { searching: boolean; locations: ILocationHookResponse[] } = useLocation(
		city,
		country,
	)

	const [loading, setLoading] = useState<boolean>(false)

	const [postalError, setPostalError] = useState(false)

	const [landlordValidationError, setLandlordValidationError] = useState(false)
	const [landlordValidationText, setLandlordValidationText] = useState('')

	const [cityValidationError, setCityValidationError] = useState(false)
	const [cityValidationErrorText, setCityValidationErrorText] = useState('')

	const { executeRecaptcha } = useReCaptcha()

	const handleSpamDetected = (detectionMethod: string) => {
		posthog.capture('spam_review_detected', {
			method: detectionMethod,
			landlord,
		})

		openModal('spamReview', {
			landlord,
			detectionMethod,
		})
	}

	// Check for already reviewed landlord from browser
	const [localReviewedLandlords, setLocalReviewedLandlords] = useState<
		string[] | null
	>(null)

	useEffect(() => {
		const prevLandlords = localStorage.getItem('rtl')
		if (prevLandlords) {
			const landlordArr = prevLandlords.split(',')
			setLocalReviewedLandlords(landlordArr)
		}
	}, [])

	useEffect(() => {
		if (reviewId) {
			localStorage.setItem(
				'rtl-id',
				JSON.stringify({
					id: reviewId,
					userCode: userKey,
				}),
			)
		}
	}, [userKey])

	const checkLandlord = (str: string) => {
		if (localReviewedLandlords) {
			return localReviewedLandlords.indexOf(str) > -1
		}
		return false
	}

	useEffect(() => {
		if (postal) {
			if (postcodeValidator(postal, country)) {
				setPostalError(false)
				setLoading(false)
			} else {
				setPostalError(true)
			}
		}
	}, [postal, country])

	const handleSubmit = async () => {
		if (landlord.trim().length < 1) {
			setLandlordValidationError(true)
			setLandlordValidationText(t('alerts.landlord-validation'))
			return
		}
		if (checkLandlord(landlord.toLocaleUpperCase())) {
			handleSpamDetected('localStorageDetection')
			return
		}
		if (city.trim().length < 1) {
			setCityValidationError(true)
			setCityValidationErrorText(t('alerts.city-validation'))
			return
		}

		if (
			postcodeValidator(postal, country) ||
			(postal.length === 0 && isIreland)
		) {
			setLoading(true)
			const token = await executeRecaptcha('review_form')
			if (token) {
				fetch(`/api/review/submit-review`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						captchaToken: token,
						review: {
							landlord: landlord.trim(),
							country_code: country,
							city: city.trim(),
							state: province,
							zip: postal.trim(),
							review: review.trim(),
							repair: repair,
							health: health,
							stability: stability,
							privacy: privacy,
							respect: respect,
							flagged: false,
							flagged_reason: '',
							admin_approved: false,
							admin_edited: false,
							rent: rent,
						},
					}),
				})
					.then((result: Response) => {
						if (!result.ok) {
							throw new Error()
						} else {
							return result.json()
						}
					})
					.then((data: ReviewResponseStatus) => {
						if (!data.success) {
							handleSpamDetected('DBDetection')
							throw new Error()
						} else {
							openModal('copyUserCode', { code: data.user_code })
							setReviewId(data.review_id)
						}
					})
					.then(() => {
						const storageItem = localStorage.getItem('rtl')
						if (storageItem) {
							const newItem = `${storageItem},${landlord.toLocaleUpperCase()}`
							localStorage.setItem('rtl', newItem)
						} else {
							localStorage.setItem('rtl', `${landlord.toLocaleUpperCase()}`)
						}
					})
					.catch(() => {
						toast.error('ERROR: Please try again')
					})
					.finally(() => {
						setLoading(false)
					})
			} else {
				toast.error('ERROR:Please try again')
			}
		} else {
			setPostalError(true)
		}
	}

	useEffect(() => {
		switch (country) {
			case Country.GB:
				dispatch(updateProvince('England'))
				break
			case Country.AU:
				dispatch(updateProvince('Australian Capital Territory'))
				break
			case Country.US:
				dispatch(updateProvince('Alabama'))
				break
			case Country.NZ:
				dispatch(updateProvince('Auckland'))
				break
			case Country.DE:
				dispatch(updateProvince('Baden-Württemberg'))
				break
			case Country.IE:
				dispatch(updateProvince('Carlow'))
				dispatch(updatePostal(''))
				break
			case Country.NO:
				dispatch(updateProvince('Oslo'))
				break
			default:
				dispatch(updateProvince('Alberta'))
		}
	}, [country])

	return (
		<div
			className={classNames(
				'container flex w-full flex-col items-center justify-center rounded-3xl px-2 sm:px-0 lg:h-full',
			)}
			data-testid='create-review-form-1'
		>
			<div className='bg-background w-full rounded-3xl px-2 pb-8 shadow-lg sm:px-0 sm:pb-12'>
				<div className='w-full px-3 py-1 pt-4 sm:px-6 sm:pt-6'>
					<LandlordForm
						landlordValidationError={landlordValidationError}
						landlordValidationText={landlordValidationText}
					/>
				</div>

				<div className='w-full px-3 py-1 sm:px-6'>
					<LocationForm
						locations={locations}
						searching={searching}
						cityValidationError={cityValidationError}
						cityValidationErrorText={cityValidationErrorText}
						postalError={postalError}
					/>
				</div>

				<div className='w-full overflow-hidden px-3 py-1 sm:px-6'>
					<RatingForm />
				</div>

				<div className='w-full overflow-hidden px-3 py-1 sm:px-6'>
					<WrittenReviewForm />
				</div>
			</div>

			<div className='border-b-primary w-full overflow-hidden border-b-2 p-4 py-2'>
				<div className='w-full py-5'>
					<div
						className='flex justify-center gap-5 pt-3 sm:gap-3'
						data-testid='create-review-form-submit-button-1'
					>
						{loading ? (
							<Spinner />
						) : (
							<Button
								disabled={loading || review.length > 2000}
								onClick={() => {
									posthog.capture('create_review_submitted', {
										landlord,
									})
									handleSubmit().catch(() => {
										posthog.capture('create_review_submit_error', {
											landlord,
										})
										console.error('Error submitting Review')
									})
								}}
							>
								{t('createreview.review-form.submit')}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
export default ReviewForm
