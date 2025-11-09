import React, { useEffect, useState } from 'react'
import Button from '../ui/button'
import SuccessModal from './success-modal'
import { postcodeValidator } from 'postcode-validator'
import SpamReviewModal from '@/components/create-review/SpamReviewModal'
import { useLocation } from '@/util/hooks/useLocation'
import { ILocationHookResponse } from '@/util/interfaces/interfaces'
import { useReCaptcha } from 'next-recaptcha-v3'
import Spinner from '../ui/Spinner'
import { Transition, TransitionChild } from '@headlessui/react'
import ReviewPreview from './components/ReviewPreview'
import LandlordForm from './components/LandlordForm'
import { classNames } from '@/util/helpers/helper-functions'
import ReviewHero from './components/CreateReviewHero'
import LocationForm from './components/CreateReviewLocationForm'
import RatingForm from './components/RatingForm'
import WrittenReviewForm from './components/WrittenReviewForm'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Country } from '@/types/review.types'
import { updatePostal, updateProvince } from '@/redux/review/reviewSlice'
import CopyUserCodeModal from '../modal/CopyUserCodeModal'
import { ReviewResponseStatus } from '@/lib/review/types/Responses'

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
	const dispatch = useAppDispatch()

	const [userCode, setUserCode] = useState('')
	const [reviewId, setReviewId] = useState<number | null>(null)

	const isIreland = country === Country.IE

	const [getStarted, setGetStarted] = useState(false)
	const [landlordOpen, setLandlordOpen] = useState(false)

	const [showLocationForm, setShowLocationForm] = useState(false)
	const [locationOpen, setLocationOpen] = useState(false)

	const [showRatingForm, setShowRatingForm] = useState(false)
	const [ratingsOpen, setRatingsOpen] = useState(false)

	const [showReviewForm, setShowReviewForm] = useState(false)
	const [reviewOpen, setReviewOpen] = useState(false)

	const [showPreview, setShowPreview] = useState(false)

	const [successModalOpen, setSuccessModalOpen] = useState(false)
	const [codeModalOpen, setCodeModalOpen] = useState(false)

	const [spamReviewModalOpen, setSpamReviewModalOpen] = useState(false)
	const [spamDetectionMethod, setSpamDetectionMethod] = useState(
		'localStorageDetection',
	)

	const {
		searching,
		locations,
	}: { searching: boolean; locations: ILocationHookResponse[] } = useLocation(
		city,
		country,
	)

	const [disclaimerOne, setDisclaimerOne] = useState(false)
	const [disclaimerTwo, setDisclaimerTwo] = useState(false)
	const [disclaimerThree, setDisclaimerThree] = useState(false)
	const [loading, setLoading] = useState<boolean>(false)

	const [postalError, setPostalError] = useState(false)

	const [landlordValidationError, setLandlordValidationError] = useState(false)
	const [landlordValidationText, setLandlordValidationText] = useState('')

	const [cityValidationError, setCityValidationError] = useState(false)
	const [cityValidationErrorText, setCityValidationErrorText] = useState('')

	const { executeRecaptcha } = useReCaptcha()

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
					userCode,
				}),
			)
		}
	}, [userCode])

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
			setSpamReviewModalOpen(true)
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
							setSpamDetectionMethod('DBDetection')
							setSpamReviewModalOpen(true)
							throw new Error()
						} else {
							setUserCode(data.user_code)
							setReviewId(data.review_id)
						}
					})
					.then(() => {
						setCodeModalOpen(true)
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

	const ratings = [
		{ title: 'Health and Safety', rating: health },
		{ title: 'Respect', rating: respect },
		{ title: 'Privacy', rating: privacy },
		{ title: 'Repair', rating: repair },
		{ title: 'Rental Stability', rating: stability },
	]

	return (
		<div
			className={classNames(
				'container flex w-full flex-col items-center justify-center px-4 sm:px-0',
				getStarted ? '' : 'lg:h-full',
			)}
			data-testid='create-review-form-1'
		>
			<CopyUserCodeModal
				open={codeModalOpen}
				setOpen={setCodeModalOpen}
				setShareOpen={setSuccessModalOpen}
				code={userCode}
			/>
			<SuccessModal isOpen={successModalOpen} setIsOpen={setSuccessModalOpen} />
			<SpamReviewModal
				landlord={landlord}
				isOpen={spamReviewModalOpen}
				setIsOpen={setSpamReviewModalOpen}
				detectionMethod={spamDetectionMethod}
			/>

			<ReviewHero
				setGetStarted={setGetStarted}
				setLandlordOpen={setLandlordOpen}
				getStarted={getStarted}
			/>

			<Transition show={getStarted}>
				<TransitionChild
					enterFrom='transform scale-95 opacity-0 max-h-0'
					enterTo='transform scale-100 opacity-100 max-h-96'
					leaveFrom='transform scale-100 opacity-100 max-h-96'
					leaveTo='transform scale-95 opacity-0 max-h-0'
				>
					<div className='flex w-full flex-col gap-3 border-b-2 border-b-teal-600 p-4 transition-all duration-500'>
						<LandlordForm
							landlordOpen={landlordOpen}
							setLandlordOpen={setLandlordOpen}
							setShowLocationForm={setShowLocationForm}
							setLocationOpen={setLocationOpen}
							landlordValidationError={landlordValidationError}
							landlordValidationText={landlordValidationText}
						/>
					</div>
				</TransitionChild>
			</Transition>

			<Transition show={showLocationForm}>
				<TransitionChild
					enterFrom='transform scale-95 opacity-0 max-h-0'
					enterTo='transform scale-100 opacity-100 max-h-96'
					leaveFrom='transform scale-100 opacity-100 max-h-96'
					leaveTo='transform scale-95 opacity-0 max-h-0'
				>
					<div className='w-full border-b-2 border-b-teal-600 p-4 transition-all duration-500'>
						<LocationForm
							locationOpen={locationOpen}
							setLocationOpen={setLocationOpen}
							locations={locations}
							searching={searching}
							cityValidationError={cityValidationError}
							cityValidationErrorText={cityValidationErrorText}
							postalError={postalError}
							setShowRatingForm={setShowRatingForm}
							setRatingsOpen={setRatingsOpen}
						/>
					</div>
				</TransitionChild>
			</Transition>

			<Transition show={showRatingForm}>
				<TransitionChild
					enterFrom='transform scale-95 opacity-0 max-h-0'
					enterTo='transform scale-100 opacity-100 max-h-96'
					leaveFrom='transform scale-100 opacity-100 max-h-96'
					leaveTo='transform scale-95 opacity-0 max-h-0'
				>
					<div className='w-full overflow-hidden border-b-2 border-b-teal-600 p-4 transition-all duration-500'>
						<RatingForm
							ratingsOpen={ratingsOpen}
							setRatingsOpen={setRatingsOpen}
							ratings={ratings}
							setShowReviewForm={setShowReviewForm}
							setReviewOpen={setReviewOpen}
						/>
					</div>
				</TransitionChild>
			</Transition>

			<Transition show={showReviewForm}>
				<TransitionChild
					enterFrom='transform scale-95 opacity-0 max-h-0'
					enterTo='transform scale-100 opacity-100 max-h-96'
					leaveFrom='transform scale-100 opacity-100 max-h-96'
					leaveTo='transform scale-95 opacity-0 max-h-0'
				>
					<div className='w-full overflow-hidden border-b-2 border-b-teal-600 p-4 transition-all duration-500'>
						<WrittenReviewForm
							reviewOpen={reviewOpen}
							setReviewOpen={setReviewOpen}
							setShowPreview={setShowPreview}
						/>
					</div>
				</TransitionChild>
			</Transition>

			<Transition show={showPreview}>
				<TransitionChild
					enterFrom='transform scale-95 opacity-0 max-h-0'
					enterTo='transform scale-100 opacity-100 max-h-96'
					leaveFrom='transform scale-100 opacity-100 max-h-96'
					leaveTo='transform scale-95 opacity-0 max-h-0'
				>
					<div className='w-full overflow-hidden border-b-2 border-b-teal-600 p-4 py-4 transition-all duration-500'>
						<div className='flex w-full justify-center'>
							<ReviewPreview
								rent={rent}
								review={review}
								health={health}
								respect={respect}
								privacy={privacy}
								repair={repair}
								stability={stability}
								landlord={landlord}
								city={city}
								state={province}
								country_code={country}
								zip={postal}
							/>
						</div>
						<div className='w-full py-5'>
							<div className='mb-2 flex w-full justify-start space-x-2'>
								<div className='flex h-5 items-center'>
									<input
										id='terms-1'
										data-testid='terms-1-input'
										name='terms-1'
										type='checkbox'
										checked={disclaimerOne}
										onChange={() => setDisclaimerOne((p) => !p)}
										className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
									/>
								</div>
								<label htmlFor='terms-1' className='text-sm text-gray-500'>
									{t('createreview.review-form.disclaimer-1')}
								</label>
							</div>
							<div className='mb-2 flex w-full justify-start space-x-2'>
								<div className='flex h-5 items-center'>
									<input
										id='terms-2'
										data-testid='terms-2-input'
										name='terms-2'
										type='checkbox'
										checked={disclaimerTwo}
										onChange={() => setDisclaimerTwo((p) => !p)}
										className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
									/>
								</div>
								<label htmlFor='terms-2' className='text-sm text-gray-500'>
									{t('createreview.review-form.disclaimer-2')}
								</label>
							</div>
							<div className='mb-2 flex w-full justify-start space-x-2'>
								<div className='flex h-5 items-center'>
									<input
										id='terms-3'
										data-testid='terms-3-input'
										name='terms-3'
										type='checkbox'
										checked={disclaimerThree}
										onChange={() => setDisclaimerThree((p) => !p)}
										className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
									/>
								</div>
								<label htmlFor='terms-3' className='text-sm text-gray-500'>
									{t('createreview.review-form.disclaimer-3')}
								</label>
							</div>

							<div
								className='flex justify-center gap-5 pt-5 sm:gap-3'
								data-testid='create-review-form-submit-button-1'
							>
								{loading ? (
									<Spinner />
								) : (
									<Button
										disabled={
											!disclaimerOne ||
											!disclaimerTwo ||
											!disclaimerThree ||
											loading ||
											review.length > 2000
										}
										onClick={() => {
											posthog.capture('create_review_submitted')
											handleSubmit().catch(() => {
												posthog.capture('create_review_submit_error')
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
				</TransitionChild>
			</Transition>
		</div>
	)
}

export default ReviewForm
