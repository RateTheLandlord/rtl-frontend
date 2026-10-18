import { DialogTitle } from '@headlessui/react'
import { useRouter } from 'next/router'
import {
	EmailShareButton,
	FacebookShareButton,
	PinterestShareButton,
	RedditShareButton,
	TumblrShareButton,
	TwitterShareButton,
} from 'react-share'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'

import { useAppDispatch } from '@/redux/hooks'
import { updateSuccessModalOpen } from '@/redux/modal/modalSlice'
import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import {
	EmailIcon,
	FacebookIcon,
	PinterestIcon,
	RedditIcon,
	TumblrIcon,
	TwitterIcon,
} from 'react-share'
import ModalShell from './ModalShell'

function SuccessModal() {
	const dispatch = useAppDispatch()
	const t = useTranslations('createreview')
	const router = useRouter()

	return (
		<ModalShell
			title={t('modal.success')}
			onClose={() => dispatch(updateSuccessModalOpen(false))}
		>
			<>
				<div>
					<div className='mt-3 text-center sm:mt-5'>
						<DialogTitle
							as='h3'
							className='text-base leading-6 text-gray-900'
						></DialogTitle>

						<div className='mt-2'>
							<p className='text-sm text-gray-500'>{t('modal.support')}</p>
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
			</>
		</ModalShell>
	)
}

export default SuccessModal
