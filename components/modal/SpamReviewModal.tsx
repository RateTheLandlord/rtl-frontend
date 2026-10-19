import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import Button from '../ui/button'
import ModalShell from './ModalShell'

type SpamReviewModalProps = {
	landlord: string
	detectionMethod: string
	onClose: () => void
}

function SpamReviewModal({
	landlord,
	detectionMethod,
	onClose,
}: SpamReviewModalProps) {
	const t = useTranslations('createreview')

	posthog.capture('spam_modal_viewed', {
		landlord,
	})

	return (
		<ModalShell title={t(`${detectionMethod}.title`)} onClose={onClose}>
			<>
				<div className='mt-3 text-center sm:mt-5'>
					<div className='mt-2'>
						<p className='text-sm text-gray-500'>
							{t(`${detectionMethod}.description`)}
						</p>
					</div>
				</div>

				<div className='mt-5 flex w-full justify-end sm:mt-6'>
					<Button onClick={onClose}>{t('modal.close')}</Button>
				</div>
			</>
		</ModalShell>
	)
}

export default SpamReviewModal
