import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateSpamReviewModalOpen } from '@/redux/modal/modalSlice'
import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import Button from '../ui/button'
import ModalShell from './ModalShell'

function SpamReviewModal() {
	const { spamDetectionMethod: detectionMethod, landlord } = useAppSelector(
		(state) => state.modal,
	)
	const dispatch = useAppDispatch()
	const t = useTranslations('createreview')

	return (
		<ModalShell
			title={t(`${detectionMethod}.title`)}
			onClose={() => dispatch(updateSpamReviewModalOpen(false))}
		>
			<>
				<div className='mt-3 text-center sm:mt-5'>
					<div className='mt-2'>
						<p className='text-sm text-gray-500'>
							{t(`${detectionMethod}.description`)}
						</p>
					</div>
				</div>

				<div className='mt-5 flex w-full justify-end sm:mt-6'>
					<Button
						onClick={() => {
							dispatch(updateSpamReviewModalOpen(false))
							posthog.capture('spam_modal_viewed', {
								landlord,
							})
						}}
					>
						{t('modal.close')}
					</Button>
				</div>
			</>
		</ModalShell>
	)
}

export default SpamReviewModal
