import { useState } from 'react'
import countries from '@/util/countries/countries.json'
import { country_codes } from '@/util/helpers/getCountryCodes'

import { toast } from 'react-toastify'
import { getStates } from '@/util/countries/combineStates'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import { UserUpdateReviewResponse } from '@/lib/review/types/Responses'
import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateSelectedReview,
	updateUserEditReviewOpen,
	updateUserKey,
} from '@/redux/modal/modalSlice'
import ModalShell from './ModalShell'

const UserEditReviewModal = () => {
	const { selectedReview, userKey } = useAppSelector((state) => state.modal)
	const dispatch = useAppDispatch()
	const t = useTranslations()
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
	const [codeError, setCodeError] = useState('')

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
					dispatch(updateUserKey(''))
					dispatch(updateUserEditReviewOpen(false))
					throw new Error()
				} else {
					return result.json()
				}
			})
			.then((data: UserUpdateReviewResponse) => {
				if (data.success) {
					toast.success('Success!')
					fetch(
						`/api/force-revalidate?path=${encodeURIComponent(landlord)}`,
					).catch(() => console.error('Revalidate Failed'))

					dispatch(updateUserEditReviewOpen(false))
					dispatch(updateSelectedReview(undefined))
					posthog.capture('user_code.review_edited', {
						landlord: selectedReview?.landlord,
					})
				} else {
					setCodeError(`${t('user-code.incorrect')}`)
					posthog.capture('user_code.incorrect_code_entry', {
						landlord: selectedReview?.landlord,
						message: data.message,
					})
				}
				dispatch(updateUserKey(''))
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
				dispatch(updateSelectedReview(undefined))
				dispatch(updateUserEditReviewOpen(false))
			})
	}
	return (
		<ModalShell
			title={t('user-edit.edit')}
			onClose={() => dispatch(updateUserEditReviewOpen(false))}
		>
			<>
				<div className='mt-1'>
					<div className='sm:col-span-3'>
						<label htmlFor='landlord' className='block text-sm text-gray-700'>
							{t('user-edit.landlord')}
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='landlord'
								id='landlord'
								required
								placeholder={t('user-edit.landlord')}
								value={landlord ? landlord : selectedReview?.landlord}
								onChange={(e) => setLandlord(e.target.value)}
								className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								data-testid='create-review-form-landlord-1'
							/>
						</div>
					</div>
					<div className='sm:col-span-3'>
						<label htmlFor='country' className='block text-sm text-gray-700'>
							{t('user-edit.country')}
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
						<label htmlFor='city' className='block text-sm text-gray-700'>
							{t('user-edit.city')}
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='city'
								id='city'
								placeholder={t('user-edit.city')}
								value={city ? city : selectedReview?.city}
								required
								onChange={(e) => setCity(e.target.value)}
								className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								data-testid='create-review-form-city-1'
							/>
						</div>
					</div>
					<div className='sm:col-span-2'>
						<label htmlFor='region' className='block text-sm text-gray-700'>
							{t('user-edit.state')}
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
								{t('user-edit.zip')}
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='postal-code'
									id='postal-code'
									placeholder={t('user-edit.zip')}
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
						<label htmlFor='rent' className='block text-sm text-gray-700'>
							{t('user-edit.rent')}
						</label>
						<div className='mt-1'>
							<input
								type='number'
								name='rent'
								id='rent'
								placeholder={t('user-edit.rent')}
								required
								value={rent ? rent : selectedReview?.rent || ''}
								onChange={(e) => setRent(Number(e.target.value))}
								className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								data-testid='create-review-form-rent-1'
							/>
						</div>
					</div>
					<div className='sm:col-span-2'>
						<label htmlFor='review' className='block text-sm text-gray-700'>
							{t('user-edit.review')}
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
						<label htmlFor='user-code' className='block text-sm text-gray-700'>
							{t('user-edit.user-code')}
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='user-code'
								id='user-code'
								placeholder={t('user-edit.enter-code')}
								required
								onChange={(e) => dispatch(updateUserKey(e.target.value))}
								className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								data-testid='create-review-form-moderation-reason-1'
							/>
						</div>
						{codeError && <p className='text-red-500'>{codeError}</p>}
					</div>
				</div>
				<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
					<Button onClick={() => onSubmitEditReview()}>
						{t('user-edit.submit')}
					</Button>
					<ButtonLight
						onClick={() => {
							dispatch(updateSelectedReview(undefined))
							dispatch(updateUserEditReviewOpen(false))
						}}
					>
						{t('user-edit.cancel')}
					</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default UserEditReviewModal
