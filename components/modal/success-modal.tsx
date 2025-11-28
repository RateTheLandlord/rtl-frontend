import React, { Fragment } from 'react'
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import ButtonLight from '../ui/button-light'
import Button from '../ui/button'
import { useRouter } from 'next/router'
import {
	EmailShareButton,
	FacebookShareButton,
	PinterestShareButton,
	RedditShareButton,
	TumblrShareButton,
	TwitterShareButton,
} from 'react-share'

import {
	EmailIcon,
	FacebookIcon,
	PinterestIcon,
	RedditIcon,
	TumblrIcon,
	TwitterIcon,
} from 'react-share'
import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateSuccessModalOpen } from '@/redux/modal/modalSlice'

function SuccessModal() {
	const { successModalOpen: isOpen } = useAppSelector((state) => state.modal)
	const dispatch = useAppDispatch()
	const t = useTranslations('createreview')
	const router = useRouter()
	return (
		<div data-testid='SuccessModalComponent'>
			<Transition show={isOpen} as={Fragment}>
				<Dialog
					data-testid='success-modal-1'
					as='div'
					className='relative z-10'
					onClose={() => dispatch(updateSuccessModalOpen(false))}
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

					<div
						data-testid='success-modal-2'
						className='fixed inset-0 z-10 overflow-y-auto'
					>
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
									<div>
										<div className='mt-3 text-center sm:mt-5'>
											<DialogTitle
												as='h3'
												className='text-base leading-6 text-gray-900'
											>
												{t('modal.success')}
											</DialogTitle>

											<div className='mt-2'>
												<p className='text-sm text-gray-500'>
													{t('modal.support')}
												</p>
												<div className='mt-2 flex w-full flex-row justify-center gap-3'>
													<EmailShareButton
														onMouseDown={() =>
															posthog.capture('user_clicked_share', {
																share: 'email',
															})
														}
														url='https://ratethelandlord.org'
													>
														<EmailIcon round size='40' />
													</EmailShareButton>
													<FacebookShareButton
														onMouseDown={() =>
															posthog.capture('user_clicked_share', {
																share: 'facebook',
															})
														}
														url='https://ratethelandlord.org'
													>
														<FacebookIcon round size='40' />
													</FacebookShareButton>
													<PinterestShareButton
														onMouseDown={() =>
															posthog.capture('user_clicked_share', {
																share: 'pinterest',
															})
														}
														media='https://ratethelandlord.org/friends.webp'
														url='https://ratethelandlord.org'
													>
														<PinterestIcon round size='40' />
													</PinterestShareButton>
													<RedditShareButton
														onMouseDown={() =>
															posthog.capture('user_clicked_share', {
																share: 'reddit',
															})
														}
														url='https://ratethelandlord.org'
													>
														<RedditIcon round size='40' />
													</RedditShareButton>
													<TumblrShareButton
														onMouseDown={() =>
															posthog.capture('user_clicked_share', {
																share: 'tumblr',
															})
														}
														url='https://ratethelandlord.org'
													>
														<TumblrIcon round size='40' />
													</TumblrShareButton>
													<TwitterShareButton
														onMouseDown={() =>
															posthog.capture('user_clicked_share', {
																share: 'twitter',
															})
														}
														url='https://ratethelandlord.org'
													>
														<TwitterIcon round size='40' />
													</TwitterShareButton>
												</div>
											</div>
										</div>
									</div>
									<div className='mt-5 grid gap-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
										<ButtonLight
											onClick={() => {
												dispatch(updateSuccessModalOpen(false))
												router.reload()
											}}
										>
											{t('modal.submit-another')}
										</ButtonLight>
										<Button
											onClick={() => {
												dispatch(updateSuccessModalOpen(false))
												router.push('/reviews').catch((err) => console.log(err))
											}}
										>
											{t('modal.go-to')}
										</Button>
									</div>
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	)
}

export default SuccessModal
