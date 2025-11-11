import { UserReview } from '@/util/interfaces/interfaces'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import countries from '@/util/countries/countries.json'
import { country_codes } from '@/util/helpers/getCountryCodes'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { toast } from 'react-toastify'
import { getStates } from '@/util/countries/combineStates'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import { UserUpdateReviewResponse } from '@/lib/review/types/Responses'

interface IProps {
	selectedReview: UserReview | undefined
	handleMutate: () => void
	setSelectedReview: Dispatch<SetStateAction<UserReview | undefined>>
	userEditReviewOpen: boolean
	setUserEditReviewOpen: Dispatch<SetStateAction<boolean>>
	userKey: string
	setUserKey: Dispatch<SetStateAction<string>>
	setUserEditMode: Dispatch<SetStateAction<boolean>>
}

const UserEditReviewModal = ({
	selectedReview,
	handleMutate,
	setSelectedReview,
	userEditReviewOpen,
	setUserEditReviewOpen,
	userKey,
	setUserKey,
	setUserEditMode,
}: IProps) => {
	const [landlord, setLandlord] = useState<string>(
		selectedReview?.landlord || '',
	)
	const [country, setCountry] = useState<string>(
		selectedReview?.country_code || '',
	)
	const [city, setCity] = useState<string>(selectedReview?.city || '')
	const [province, setProvince] = useState<string>(selectedReview?.state || '')
	const [postal, setPostal] = useState<string>(selectedReview?.zip || '')
	const [review, setReview] = useState<string>(selectedReview?.review || '')
	const [rent, setRent] = useState<number | null>(selectedReview?.rent || null)

	const isIreland = country === 'IE'

	const onSubmitEditReview = () => {
		const apiUrl = '/api/user-update/update'
		const editedReview = {
			...selectedReview,
			landlord: landlord,
			country: country,
			city: city,
			state: province,
			zip: postal,
			review: review,
			rent: rent,
		}
		const body = {
			review: editedReview,
			id: selectedReview?.id,
			user_code: userKey,
		}
		fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
			.then((result) => {
				if (!result.ok) {
					setUserKey('')
					setUserEditReviewOpen(false)
					setUserEditMode(false)
					throw new Error()
				} else {
					return result.json()
				}
			})
			.then((data: UserUpdateReviewResponse) => {
				fetch(
					`/api/force-revalidate?path=${encodeURIComponent(landlord)}`,
				).catch(() => console.error('Revalidate Failed'))
				handleMutate()
				setUserEditReviewOpen(false)
				if (data.success) {
					toast.success('Success!')
				} else {
					toast.error(data.message)
				}
				setSelectedReview(undefined)
				setUserKey('')
				setUserEditMode(false)
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
				setSelectedReview(undefined)
			})
	}
	return (
		<Transition show={userEditReviewOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-10'
				onClose={setUserEditReviewOpen}
			>
				<TransitionChild
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity' />
				</TransitionChild>

				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<DialogPanel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
								<div className='mt-1'>
									<div className='sm:col-span-3'>
										<label
											htmlFor='landlord'
											className='block text-sm text-gray-700'
										>
											Landlord
										</label>
										<div className='mt-1'>
											<input
												type='text'
												name='landlord'
												id='landlord'
												required
												placeholder='Landlord'
												value={landlord ? landlord : selectedReview?.landlord}
												onChange={(e) => setLandlord(e.target.value)}
												className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
												data-testid='create-review-form-landlord-1'
											/>
										</div>
									</div>
									<div className='sm:col-span-3'>
										<label
											htmlFor='country'
											className='block text-sm text-gray-700'
										>
											Country
										</label>
										<div className='mt-1'>
											<select
												id='country'
												name='country'
												required
												value={country ? country : selectedReview?.country_code}
												onChange={(e) => setCountry(e.target.value)}
												className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											>
												{country_codes.map((country) => {
													return (
														<option key={country} value={country}>
															{countries[country as keyof typeof countries]}
														</option>
													)
												})}
											</select>
										</div>
									</div>
									<div className='sm:col-span-2'>
										<label
											htmlFor='city'
											className='block text-sm text-gray-700'
										>
											City
										</label>
										<div className='mt-1'>
											<input
												type='text'
												name='city'
												id='city'
												placeholder='city'
												value={city ? city : selectedReview?.city}
												required
												onChange={(e) => setCity(e.target.value)}
												className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
												data-testid='create-review-form-city-1'
											/>
										</div>
									</div>
									<div className='sm:col-span-2'>
										<label
											htmlFor='region'
											className='block text-sm text-gray-700'
										>
											Province / State
										</label>
										<div className='mt-1'>
											<select
												id='region'
												name='region'
												required
												value={province ? province : selectedReview?.state}
												onChange={(e) => setProvince(e.target.value)}
												className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											>
												<option>{province}</option>
												{getStates(country).map((province) => (
													<option key={province.value} value={province.value}>
														{province.name}
													</option>
												))}
											</select>
										</div>
									</div>
									{isIreland ? null : (
										<div className='sm:col-span-2'>
											<label
												htmlFor='postal-code'
												className='block text-sm text-gray-700'
											>
												Postal Code / ZIP
											</label>
											<div className='mt-1'>
												<input
													type='text'
													name='postal-code'
													id='postal-code'
													placeholder='Postal Code / ZIP'
													required
													value={postal ? postal : selectedReview?.zip}
													onChange={(e) => setPostal(e.target.value)}
													className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
													data-testid='create-review-form-postal-code-1'
												/>
											</div>
										</div>
									)}
									<div className='sm:col-span-2'>
										<label
											htmlFor='rent'
											className='block text-sm text-gray-700'
										>
											Rent
										</label>
										<div className='mt-1'>
											<input
												type='number'
												name='rent'
												id='rent'
												placeholder='Rent'
												required
												value={rent ? rent : selectedReview?.rent || ''}
												onChange={(e) => setRent(Number(e.target.value))}
												className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
												data-testid='create-review-form-rent-1'
											/>
										</div>
									</div>
									<div className='sm:col-span-2'>
										<label
											htmlFor='review'
											className='block text-sm text-gray-700'
										>
											Review
										</label>
										<textarea
											rows={4}
											name='review'
											id='review'
											className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											onChange={(e) => setReview(e.target.value)}
											value={review ? review : selectedReview?.review}
											data-testid='edit-review-modal-1'
										/>
									</div>
									<div className='sm:col-span-2'>
										<label
											htmlFor='user-code'
											className='block text-sm text-gray-700'
										>
											User Code
										</label>
										<div className='mt-1'>
											<input
												type='text'
												name='user-code'
												id='user-code'
												placeholder='Enter User Code Provided After Creating Review'
												required
												onChange={(e) => setUserKey(e.target.value)}
												className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
												data-testid='create-review-form-moderation-reason-1'
											/>
										</div>
									</div>
								</div>
								<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
									<Button onClick={() => onSubmitEditReview()}>Submit</Button>
									<ButtonLight
										onClick={() => {
											setSelectedReview(undefined)
											setUserEditReviewOpen(false)
											setUserEditMode(false)
										}}
									>
										Cancel
									</ButtonLight>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default UserEditReviewModal
