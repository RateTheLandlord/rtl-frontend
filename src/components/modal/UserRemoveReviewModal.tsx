import { UserUpdateReviewResponse } from '@/lib/review/types/Responses'
import { UserReview } from '@/util/interfaces/interfaces'
import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import ModalShell from './ModalShell'

const UserRemoveReviewModal = ({
	onClose,
	selectedReview,
}: {
	onClose: () => void
	selectedReview: UserReview
}) => {
	const t = useTranslations()
	const landlord = selectedReview?.landlord || ''
	const review = selectedReview?.review || ''
	const [codeError, setCodeError] = useState('')
	const [userCode, setUserCode] = useState('')

	const checkLocalStorageUserKey = () => {
		const key = localStorage.getItem(`rtl:${selectedReview.id}`)
		if (key) setUserCode(key)
	}

	useEffect(() => {
		checkLocalStorageUserKey()
	}, [])

	const onSubmitRemoveReview = () => {
		const apiUrl = '/api/user-update/delete'
		const body = { id: selectedReview?.id, user_code: userCode }
		if (selectedReview) {
			fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})
				.then((result) => {
					if (!result.ok) {
						onClose()
						throw new Error()
					} else {
						return result.json()
					}
				})
				.then((data: UserUpdateReviewResponse) => {
					if (data.success) {
						fetch(
							`/api/force-revalidate?path=${encodeURIComponent(
								selectedReview.landlord,
							)}`,
						)
							.then((response) => {
								if (!response.ok) {
									throw new Error('Failed to revalidate')
								}
							})
							.catch((err) => {
								console.log(err)
							})
						toast.success('Success!')
						onClose()
						posthog.capture('user_code.review_deleted', {
							landlord: selectedReview.landlord,
						})
					} else {
						setUserCode('')
						setCodeError(`${t('user-code.incorrect')}`)
						posthog.capture('user_code.incorrect_code_entry', {
							landlord: selectedReview.landlord,
							message: data.message,
						})
					}
				})
				.catch((err) => {
					console.log(err)
					toast.error(`${t('alerts.error')}`)
					onClose()
				})
		}
	}

	return (
		<ModalShell title={t('user-delete.remove')} onClose={onClose}>
			<>
				<div className='mt-1'>
					<div className='sm:col-span-3'>
						<label htmlFor='landlord' className='block text-sm text-gray-700'>
							{t('user-delete.landlord')}:{' '}
							{landlord ? landlord : selectedReview?.landlord}
						</label>
					</div>
					<div className='sm:col-span-2'>
						<label htmlFor='review' className='block text-sm text-gray-700'>
							{t('user-delete.review')}:{' '}
							{review ? review : selectedReview?.review}
						</label>
					</div>
					<div className='sm:col-span-2'>
						<label htmlFor='user-code' className='block text-sm text-gray-700'>
							{t('user-delete.user-code')}
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='user-code'
								id='user-code'
								placeholder={t('user-delete.enter-code')}
								required
								value={userCode}
								onChange={(e) => setUserCode(e.target.value)}
								className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								data-testid='create-review-form-moderation-reason-1'
							/>
						</div>
						{codeError && <p className='text-red-500'>{codeError}</p>}
					</div>
				</div>
				<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
					<Button onClick={() => onSubmitRemoveReview()}>
						{t('user-delete.submit')}
					</Button>
					<ButtonLight onClick={onClose}>{t('user-delete.cancel')}</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default UserRemoveReviewModal
