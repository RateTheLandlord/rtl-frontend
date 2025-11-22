import { Fragment, useState } from 'react'
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { toast } from 'react-toastify'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import CloseButton from '../ui/CloseButton'
import { UserUpdateReviewResponse } from '@/lib/review/types/Responses'
import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateSelectedReview,
	updateUserKey,
	updateUserRemoveReviewOpen,
} from '@/redux/modal/modalSlice'

const UserRemoveReviewModal = () => {
	const { selectedReview, userKey, userRemoveReviewOpen } = useAppSelector(
		(state) => state.modal,
	)
	const dispatch = useAppDispatch()
	const t = useTranslations()
	const landlord = selectedReview?.landlord || ''
	const review = selectedReview?.review || ''
	const [codeError, setCodeError] = useState('')

	const onSubmitRemoveReview = () => {
		const apiUrl = '/api/user-update/delete'
		const body = { id: selectedReview?.id, user_code: userKey }
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
						dispatch(updateUserKey(''))
						dispatch(updateUserRemoveReviewOpen(false))
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
						dispatch(updateSelectedReview(undefined))
						dispatch(updateUserRemoveReviewOpen(false))
						posthog.capture('user_code.review_deleted')
					} else {
						dispatch(updateUserKey(''))
						setCodeError(`${t('user-code.incorrect')}`)
						posthog.capture('user_code.incorrect_code_entry', {
							message: data.message,
						})
					}
				})
				.catch((err) => {
					console.log(err)
					toast.error(`${t('alerts.error')}`)
					dispatch(updateSelectedReview(undefined))
					dispatch(updateUserRemoveReviewOpen(false))
				})
		}
	}

	return (
		<Transition show={userRemoveReviewOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-10'
				onClose={() => dispatch(updateUserRemoveReviewOpen(false))}
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
							<DialogPanel className='relative transform gap-3 overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
								<div className='absolute top-0 right-0 hidden pt-4 pr-4 sm:block'>
									<CloseButton
										onClick={() => dispatch(updateUserRemoveReviewOpen(false))}
									/>
								</div>
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
										<DialogTitle
											as='h3'
											className='text-lg leading-6 text-gray-900'
										>
											{t('user-delete.remove')}
										</DialogTitle>
									</div>
								</div>
								<div className='mt-1'>
									<div className='sm:col-span-3'>
										<label
											htmlFor='landlord'
											className='block text-sm text-gray-700'
										>
											{t('user-delete.landlord')}:{' '}
											{landlord ? landlord : selectedReview?.landlord}
										</label>
									</div>
									<div className='sm:col-span-2'>
										<label
											htmlFor='review'
											className='block text-sm text-gray-700'
										>
											{t('user-delete.review')}:{' '}
											{review ? review : selectedReview?.review}
										</label>
									</div>
									<div className='sm:col-span-2'>
										<label
											htmlFor='user-code'
											className='block text-sm text-gray-700'
										>
											{t('user-delete.user-code')}
										</label>
										<div className='mt-1'>
											<input
												type='text'
												name='user-code'
												id='user-code'
												placeholder={t('user-delete.enter-code')}
												required
												onChange={(e) =>
													dispatch(updateUserKey(e.target.value))
												}
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
									<ButtonLight
										onClick={() => {
											dispatch(updateSelectedReview(undefined))
											dispatch(updateUserRemoveReviewOpen(false))
										}}
									>
										{t('user-delete.cancel')}
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

export default UserRemoveReviewModal
