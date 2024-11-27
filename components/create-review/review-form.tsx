/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react'
import AddReviewModal from './add-review-modal'
import Button from '../ui/button'
import MaliciousStringAlert from '../alerts/MaliciousStringAlert'
import SuccessModal from './success-modal'
import { postcodeValidator } from 'postcode-validator'
import { useTranslation } from 'react-i18next'
import SpamReviewModal from '@/components/create-review/SpamReviewModal'
import SheldonModal from '@/components/create-review/SheldonModal'
import { sheldonReview } from '@/components/create-review/helper'
import { useLocation } from '@/util/hooks/useLocation'
import {
	ILocationHookResponse,
	ReviewResponseStatus,
} from '@/util/interfaces/interfaces'
import { useReCaptcha } from 'next-recaptcha-v3'
import Spinner from '../ui/Spinner'
import { Transition, TransitionChild } from '@headlessui/react'
import ReviewPreview from './components/ReviewPreview'
import LandlordForm from './components/LandlordForm'
import { classNames } from '@/util/helpers/helper-functions'
import ReviewHero from './components/ReviewHero'
import LocationForm from './components/LocationForm'
import RatingForm from './components/RatingForm'
import WrittenReviewForm from './components/WrittenReviewForm'
import { toast } from 'react-toastify'

function ReviewForm(): JSX.Element {
	const { t } = useTranslation('create')

	const [getStarted, setGetStarted] = useState(false)
	const [landlordOpen, setLandlordOpen] = useState(false)

	const [showLocationForm, setShowLocationForm] = useState(false)
	const [locationOpen, setLocationOpen] = useState(false)

	const [showRatingForm, setShowRatingForm] = useState(false)
	const [ratingsOpen, setRatingsOpen] = useState(false)

	const [showReviewForm, setShowReviewForm] = useState(false)
	const [reviewOpen, setReviewOpen] = useState(false)

	const [showPreview, setShowPreview] = useState(false)

	const [maliciousAlertOpen, setMaliciousAlertOpen] = useState(false)
	const [successModalOpen, setSuccessModalOpen] = useState(false)
	const [reviewModalOpen, setReviewModalOpen] = useState(false)
	const [spamReviewModalOpen, setSpamReviewModalOpen] = useState(false)
	const [spamDetectionMethod, setSpamDetectionMethod] = useState(
		'localStorageDetection',
	)
	const [sheldonReviewOpen, setSheldonReviewOpen] = useState(false)

	const [landlord, setLandlord] = useState<string>('')
	const [country, setCountry] = useState<string>('AU')
	const [city, setCity] = useState<string>('')
	const [province, setProvince] = useState<string>('Alberta')
	const [postal, setPostal] = useState<string>('')
	const [rent, setRent] = useState<number | null>(null)

	const {
		searching,
		locations,
	}: { searching: boolean; locations: Array<ILocationHookResponse> } =
		useLocation(city, country)

	const [repair, setRepair] = useState<number>(3)
	const [health, setHealth] = useState<number>(3)
	const [stability, setStability] = useState<number>(3)
	const [privacy, setPrivacy] = useState<number>(3)
	const [respect, setRespect] = useState<number>(3)
	const [review, setReview] = useState<string>('')

	const [disclaimerOne, setDisclaimerOne] = useState(false)
	const [disclaimerTwo, setDisclaimerTwo] = useState(false)
	const [disclaimerThree, setDisclaimerThree] = useState(false)
	const [loading, setLoading] = useState<boolean>(false)

	const [postalError, setPostalError] = useState(false)
	const [touchedPostal, setTouchedPostal] = useState(false)

	const [landlordValidationError, setLandlordValidationError] = useState(false)
	const [landlordValidationText, setLandlordValidationText] = useState('')

	const [cityValidationError, setCityValidationError] = useState(false)
	const [cityValidationErrorText, setCityValidationErrorText] = useState('')

	// Additional state for disabling submit
	const [maliciousStringDetected, setMaliciousStringDetected] = useState(false)

	const { executeRecaptcha } = useReCaptcha()

	// Check for already reviewed landlord from browser
	const [localReviewedLandlords, setLocalReviewedLandlords] =
		useState<Array<string> | null>(null)

	useEffect(() => {
		const prevLandlords = localStorage.getItem('rtl')
		if (prevLandlords) {
			const landlordArr = prevLandlords.split(',')
			setLocalReviewedLandlords(landlordArr)
		}
	}, [])

	const checkLandlord = (str: string) => {
		if (localReviewedLandlords) {
			return localReviewedLandlords.indexOf(str) > -1
		}
		return false
	}

	const checkSheldon = () => {
		if (/sheldon rakowsky/i.test(landlord)) {
			return review === sheldonReview
		}
		return false
	}

	// Malicious string check
	const detectMaliciousString = (stringToCheck: string): boolean => {
		const maliciousPatterns = /<script>|http|\p{Extended_Pictographic}/giu
		return maliciousPatterns.test(stringToCheck)
	}

	// Updated text change handler with malicious string check
	const handleTextChange = (e: string, inputName: string) => {
		const stringIsMalicious = detectMaliciousString(e)

		switch (inputName) {
			case 'landlord':
				if (stringIsMalicious) {
					setMaliciousStringDetected(true)
					setMaliciousAlertOpen(true)
				} else {
					setLandlord(e)
					setMaliciousStringDetected(false)
				}
				break
			case 'city':
				if (stringIsMalicious) {
					setMaliciousStringDetected(true)
					setMaliciousAlertOpen(true)
				} else {
					setCity(e)
					setMaliciousStringDetected(false)
				}
				break
			case 'postal':
				if (stringIsMalicious) {
					setMaliciousStringDetected(true)
					setMaliciousAlertOpen(true)
				} else {
					setPostal(e)
					setMaliciousStringDetected(false)
					setTouchedPostal(true)
				}
				break
			case 'review':
				if (stringIsMalicious) {
					setMaliciousStringDetected(true)
					setMaliciousAlertOpen(true)
				} else {
					setReview(e)
					setMaliciousStringDetected(false)
				}
				break
			case 'rent':
				if (stringIsMalicious) {
					setMaliciousStringDetected(true)
					setMaliciousAlertOpen(true)
				} else {
					setRent(Number(e))
					setMaliciousStringDetected(false)
				}
				break
		}
	}

	useEffect(() => {
		if (touchedPostal) {
			if (postcodeValidator(postal, country)) {
				setPostalError(false)
				setLoading(false)
			} else {
				setPostalError(true)
			}
		}
	}, [postal, country, touchedPostal])

	const handleSubmit = async () => {
		if (landlord.trim().length < 1) {
			setLandlordValidationError(true)
			setLandlordValidationText('Landlord Name cannot be empty')
			return
		}
		if (checkLandlord(landlord.toLocaleUpperCase())) {
			setSpamReviewModalOpen(true)
			return
		}
		if (city.trim().length < 1) {
			setCityValidationError(true)
			setCityValidationErrorText('City cannot be empty')
			return
		}
		if (checkSheldon()) {
			setSheldonReviewOpen(true)
			return
		}
		if (review.trim().length < 1) {
			setReviewModalOpen(true)
		} else {
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
							}
						})
						.then(() => {
							setSuccessModalOpen(true)
							const storageItem = localStorage.getItem('rtl')
							if (storageItem) {
								const newItem = `${storageItem},${landlord.toLocaleUpperCase()}`
								localStorage.setItem('rtl', newItem)
							} else {
								localStorage.setItem('rtl', `${landlord.toLocaleUpperCase()}`)
							}
						})
						.catch(() => {
							toast.error('Failure: Something went wrong, please try again.')
						})
						.finally(() => {
							setLoading(false)
						})
				} else {
					toast.error('Failure: Something went wrong, please try again.')
				}
			} else {
				setPostalError(true)
			}
		}
	}

	useEffect(() => {
		if (country === 'GB') {
			setProvince('England')
		} else if (country === 'AU') {
			setProvince('Northern Territory')
		} else if (country === 'US') {
			setProvince('Alabama')
		} else if (country === 'NZ') {
			setProvince('Marlborough')
		} else if (country === 'DE') {
			setProvince('Baden-Württemberg')
		} else if (country === 'IE') {
			setProvince('Dublin')
			setPostal('')
		} else if (country === 'NO') {
			setProvince('Oslo')
		} else {
			setProvince('Alberta')
		}
	}, [country])

	const setLandlordName = (landlordName: string) => {
		setLandlordValidationError(false)
		setLandlord(landlordName)
	}

	const setCityName = (cityName: string) => {
		setCityValidationError(false)
		setCity(cityName)
	}

	const isIreland = country === 'IE'

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
			{maliciousAlertOpen && (
				<MaliciousStringAlert setMaliciousAlertOpen={setMaliciousAlertOpen} />
			)}
			<SuccessModal isOpen={successModalOpen} setIsOpen={setSuccessModalOpen} />
			<AddReviewModal isOpen={reviewModalOpen} setIsOpen={setReviewModalOpen} />
			<SpamReviewModal
				isOpen={spamReviewModalOpen}
				setIsOpen={setSpamReviewModalOpen}
				detectionMethod={spamDetectionMethod}
			/>
			<SheldonModal
				isOpen={sheldonReviewOpen}
				setIsOpen={setSheldonReviewOpen}
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
							landlord={landlord}
							setLandlordName={setLandlordName}
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
							city={city}
							province={province}
							country={country}
							isIreland={isIreland}
							postal={postal}
							rent={rent}
							setLocationOpen={setLocationOpen}
							setCountry={setCountry}
							setCityName={setCityName}
							locations={locations}
							searching={searching}
							cityValidationError={cityValidationError}
							cityValidationErrorText={cityValidationErrorText}
							setProvince={setProvince}
							handleTextChange={handleTextChange}
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
							repair={repair}
							setRepair={setRepair}
							health={health}
							setHealth={setHealth}
							stability={stability}
							setStability={setStability}
							privacy={privacy}
							setPrivacy={setPrivacy}
							respect={respect}
							setRespect={setRespect}
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
							review={review}
							reviewOpen={reviewOpen}
							setReviewOpen={setReviewOpen}
							handleTextChange={handleTextChange}
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
										name='terms-1'
										type='checkbox'
										checked={disclaimerOne}
										onChange={() => setDisclaimerOne((p) => !p)}
										className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
									/>
								</div>
								<label htmlFor='terms-1' className='text-sm text-gray-500'>
									{t('create-review.review-form.disclaimer-1')}
								</label>
							</div>
							<div className='mb-2 flex w-full justify-start space-x-2'>
								<div className='flex h-5 items-center'>
									<input
										id='terms-2'
										name='terms-2'
										type='checkbox'
										checked={disclaimerTwo}
										onChange={() => setDisclaimerTwo((p) => !p)}
										className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
									/>
								</div>
								<label htmlFor='terms-2' className='text-sm text-gray-500'>
									{t('create-review.review-form.disclaimer-2')}
								</label>
							</div>
							<div className='mb-2 flex w-full justify-start space-x-2'>
								<div className='flex h-5 items-center'>
									<input
										id='terms-3'
										name='terms-3'
										type='checkbox'
										checked={disclaimerThree}
										onChange={() => setDisclaimerThree((p) => !p)}
										className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
									/>
								</div>
								<label htmlFor='terms-3' className='text-sm text-gray-500'>
									{t('create-review.review-form.disclaimer-3')}
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
											maliciousStringDetected ||
											loading ||
											review.length > 2000
										}
										onClick={() => handleSubmit()}
									>
										Submit Review
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
