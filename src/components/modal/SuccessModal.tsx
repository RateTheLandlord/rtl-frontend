import { useRouter } from 'next/router'
import {
	BlueskyIcon,
	BlueskyShareButton,
	EmailShareButton,
	FacebookShareButton,
	PinterestShareButton,
	RedditShareButton,
	TumblrShareButton,
	XIcon,
	XShareButton,
} from 'react-share'
import Button from '../ui/Button'

import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import {
	EmailIcon,
	FacebookIcon,
	PinterestIcon,
	RedditIcon,
	TumblrIcon,
} from 'react-share'
import ModalShell from './ModalShell'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { resetReview } from '@/redux/review/reviewSlice'

function SuccessModal({ onClose }: { onClose: () => void }) {
	const dispatch = useAppDispatch()
	const t = useTranslations('createreview')
	const router = useRouter()
	const { country, province } = useAppSelector((state) => state.review)

	return (
		<ModalShell title={t('modal.success')} onClose={onClose}>
			<div>
				<div className='mt-3 text-center sm:mt-5'>
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
								<EmailIcon size='40' />
							</EmailShareButton>
							<FacebookShareButton
								onMouseDown={() =>
									posthog.capture('user_clicked_share', {
										share: 'facebook',
									})
								}
								url='https://ratethelandlord.org'
							>
								<FacebookIcon size='40' />
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
								<PinterestIcon size='40' />
							</PinterestShareButton>
							<RedditShareButton
								onMouseDown={() =>
									posthog.capture('user_clicked_share', {
										share: 'reddit',
									})
								}
								url='https://ratethelandlord.org'
							>
								<RedditIcon size='40' />
							</RedditShareButton>
							<TumblrShareButton
								onMouseDown={() =>
									posthog.capture('user_clicked_share', {
										share: 'tumblr',
									})
								}
								url='https://ratethelandlord.org'
							>
								<TumblrIcon size='40' />
							</TumblrShareButton>
							<XShareButton
								onMouseDown={() =>
									posthog.capture('user_clicked_share', {
										share: 'twitter',
									})
								}
								url='https://ratethelandlord.org'
							>
								<XIcon size='40' />
							</XShareButton>
							<BlueskyShareButton
								onMouseDown={() =>
									posthog.capture('user_clicked_share', {
										share: 'bluesky',
									})
								}
								url='https://ratethelandlord.org'
							>
								<BlueskyIcon size='40' />
							</BlueskyShareButton>
						</div>
					</div>
				</div>
			</div>
			<div className='mt-5 flex w-full justify-center'>
				<Button
					onClick={() => {
						dispatch(resetReview())
						onClose()
						router
							.push(`/reviews?country=${country}&state=${province}`)
							.catch((err) => console.log(err))
					}}
				>
					{t('modal.go-to')}
				</Button>
			</div>
		</ModalShell>
	)
}

export default SuccessModal
