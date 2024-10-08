/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react'
import AddReviewModal from './add-review-modal'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import MaliciousStringAlert from '../alerts/MaliciousStringAlert'
import RatingsRadio from './ratings-radio'
import SuccessModal from './success-modal'
import { postcodeValidator } from 'postcode-validator'
import { useTranslation } from 'react-i18next'
import SpamReviewModal from '@/components/create-review/SpamReviewModal'
import SheldonModal from '@/components/create-review/SheldonModal'
import { sheldonReview } from '@/components/create-review/helper'
import { useLocation } from '@/util/hooks/useLocation'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'
import CityComboBox from '@/components/create-review/components/CityComboBox'
import LandlordComboBox from '@/components/create-review/components/LandlordComboBox'
import { ILocationHookResponse } from '@/util/interfaces/interfaces'
import { useReCaptcha } from 'next-recaptcha-v3'
import Spinner from '../ui/Spinner'
import CountrySelector from '../ui/CountrySelector'
import StateSelector from '../ui/StateSelector'
import TextInput from '../ui/TextInput'
import LargeTextInput from '../ui/LargeTextInput'
import { useAppDispatch } from '@/redux/hooks'
import { updateAlertOpen, updateAlertSuccess } from '@/redux/alert/alertSlice'
import { Transition, TransitionChild } from '@headlessui/react'
import RatingStars from '../ui/RatingStars'
import ReviewPreview from './components/ReviewPreview'

function ReviewForm(): JSX.Element {
	const { t } = useTranslation('create')
	const dispatch = useAppDispatch()

	const [getStarted, setGetStarted] = useState(false)
	const [showLocationForm, setShowLocationForm] = useState(false)
	const [showRatingForm, setShowRatingForm] = useState(false)
	const [showReviewForm, setShowReviewForm] = useState(false)
	const [showPreview, setShowPreview] = useState(false)

	const [maliciousAlertOpen, setMaliciousAlertOpen] = useState(false)
	const [successModalOpen, setSuccessModalOpen] = useState(false)
	const [reviewModalOpen, setReviewModalOpen] = useState(false)
	const [spamReviewModalOpen, setSpamReviewModalOpen] = useState(false)
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
	const {
		isSearching,
		landlordSuggestions,
	}: { isSearching: boolean; landlordSuggestions: Array<string> } =
		useLandlordSuggestions(landlord)

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
							dispatch(updateAlertSuccess(false))
							dispatch(updateAlertOpen(true))
						})
						.finally(() => {
							setLoading(false)
						})
				} else {
					dispatch(updateAlertSuccess(false))
					dispatch(updateAlertOpen(true))
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
			className='container flex w-full flex-col items-center px-4 sm:px-0'
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
			/>
			<SheldonModal
				isOpen={sheldonReviewOpen}
				setIsOpen={setSheldonReviewOpen}
			/>

			<div className='border-b-2 border-b-teal-600 py-2'>
				<h1 className='text-4xl '>{t('create-review.review-form.header')}</h1>
				<div className='my-3 w-full'>
					Help us create a better living experience! Please take a moment to
					rate your landlord using our feedback form. Your input is invaluable
					in ensuring a responsive and supportive environment for everyone.
					Thank you for sharing your thoughts!
				</div>
				<Button
					onClick={() => {
						setGetStarted(true)
					}}
				>
					Get Started!
				</Button>
			</div>

			<Transition show={getStarted}>
				<TransitionChild
					enterFrom='transform scale-95 opacity-0 max-h-0'
					enterTo='transform scale-100 opacity-100 max-h-96'
					leaveFrom='transform scale-100 opacity-100 max-h-96'
					leaveTo='transform scale-95 opacity-0 max-h-0'
				>
					<div className='flex w-full flex-col gap-3 overflow-hidden border-b-2 border-b-teal-600 p-4 transition-all duration-500'>
						{landlord !== null && showLocationForm ? (
							<div className='w-full transition-all duration-500'>
								{landlord}
							</div>
						) : (
							<>
								<div>
									Please enter the name of your Landlord or Property Management
									Company exactly as it appears on your Lease or Rental
									Agreement. This information is crucial, as it ensures that
									potential tenants can easily locate your property listing on
									our site. An accurate name not only helps maintain clarity but
									also builds trust within our community, allowing others to
									make informed decisions. <br />
									Please note that for privacy and security reasons, no
									addresses are allowed in this field. Taking a moment to
									double-check the spelling and format will go a long way in
									connecting your property with prospective renters. Thank you
									for your attention to detail!
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
										disabled={landlord === null}
										onClick={() => {
											setShowLocationForm(true)
										}}
									>
										Continue
									</Button>
								</div>
							</>
						)}
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
						{city !== null && showRatingForm ? (
							<div>{`${city}, ${province}, ${country}${
								isIreland ? '' : `,${postal}`
							}`}</div>
						) : (
							<>
								<div className='grid w-full grid-cols-2 gap-3 overflow-hidden'>
									<CountrySelector setValue={setCountry} />

									<CityComboBox
										name={t('create-review.review-form.city')}
										state={city}
										setState={setCityName}
										options={locations}
										searching={searching}
										error={cityValidationError}
										errorText={cityValidationErrorText}
									/>

									<StateSelector
										value={province}
										country={country}
										setValue={setProvince}
									/>
									{isIreland ? null : (
										<TextInput
											id='postal-code'
											title={t('create-review.review-form.zip')}
											placeHolder={t('create-review.review-form.zip')}
											value={postal}
											setValue={(str: string) =>
												handleTextChange(str, 'postal')
											}
											error={postalError}
											errorText={t('create-review.review-form.postal-error')}
											testid='create-review-form-postal-code-1'
										/>
									)}
									<TextInput
										id='rent'
										type='number'
										title={t('create-review.review-form.rent')}
										placeHolder={t('create-review.review-form.rent')}
										value={rent}
										setValue={(str: string) => handleTextChange(str, 'rent')}
										testid='create-review-form-rent-1'
									/>
								</div>
								<div className='flex w-full justify-end'>
									<Button
										disabled={
											isIreland
												? city === null || city.length === 0
												: city === null ||
												  city.length === 0 ||
												  postal.length === 0
										}
										onClick={() => setShowRatingForm(true)}
									>
										Continue
									</Button>
								</div>
							</>
						)}
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
						{showReviewForm ? (
							<div className='flex w-full flex-row gap-6'>
								{ratings.map((rating) => {
									return (
										<div
											key={rating.title}
											className='flex flex-col items-center'
										>
											<p>{rating.title}</p>
											<RatingStars value={rating.rating} />
										</div>
									)
								})}
							</div>
						) : (
							<>
								<div className='flex flex-col gap-2'>
									<h3 className='mt-2 text-lg  leading-6 text-gray-900'>
										{t('create-review.review-form.rate-title')}
									</h3>
									<RatingsRadio
										title={t('create-review.review-form.repair')}
										rating={repair}
										setRating={setRepair}
										tooltip={t('create-review.review-form.repair_description')}
									/>

									<RatingsRadio
										title={t('create-review.review-form.health')}
										rating={health}
										setRating={setHealth}
										tooltip={t('create-review.review-form.health_description')}
									/>

									<RatingsRadio
										title={t('create-review.review-form.stability')}
										rating={stability}
										setRating={setStability}
										tooltip={t(
											'create-review.review-form.stability_description',
										)}
									/>

									<RatingsRadio
										title={t('create-review.review-form.privacy')}
										rating={privacy}
										setRating={setPrivacy}
										tooltip={t('create-review.review-form.privacy_description')}
									/>

									<RatingsRadio
										title={t('create-review.review-form.respect')}
										rating={respect}
										setRating={setRespect}
										tooltip={t('create-review.review-form.respect_description')}
									/>
								</div>
								<div className='flex w-full justify-end pt-2'>
									<Button onClick={() => setShowReviewForm(true)}>
										Continue
									</Button>
								</div>
							</>
						)}
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
						{showPreview ? (
							<div>{review}</div>
						) : (
							<>
								<LargeTextInput
									title={t('create-review.review-form.review')}
									setValue={(str: string) => handleTextChange(str, 'review')}
									id='review'
									placeHolder=''
									testid='create-review-form-text-1'
									limitText={t('create-review.review-form.limit', {
										length: review.length,
									})}
									length={2000}
									value={review}
								/>
								<div className='flex w-full justify-end pt-2'>
									<Button onClick={() => setShowPreview(true)}>
										Preview Review
									</Button>
								</div>
							</>
						)}
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
								<ButtonLight>
									{t('create-review.review-form.reset')}
								</ButtonLight>
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
										{t('create-review.review-form.submit')}
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
