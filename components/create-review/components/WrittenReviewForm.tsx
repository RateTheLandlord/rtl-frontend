import Button from '@/components/ui/button'
import LargeTextInput from '@/components/ui/LargeTextInput'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateReview } from '@/redux/review/reviewSlice'
import { useTranslations } from 'next-intl'
import posthog from 'posthog-js'

interface IProps {
	reviewOpen: boolean
	setReviewOpen: (bool: boolean) => void
	setShowPreview: (bool: boolean) => void
}

const WrittenReviewForm = ({
	reviewOpen,
	setReviewOpen,
	setShowPreview,
}: IProps) => {
	const t = useTranslations('createreview')
	const { review } = useAppSelector((state) => state.review)
	const dispatch = useAppDispatch()
	return !reviewOpen ? (
		<div className='flex w-full flex-row items-center justify-between transition-all duration-500'>
			<div className='flex flex-col gap-2'>
				<p className='text-xs'>{t('written-review.title')}</p>
				<p className='text-md wrap-break-word'>{review}</p>
			</div>
			<div>
				<Button
					onClick={() => {
						setReviewOpen(true)
					}}
				>
					{t('edit')}
				</Button>
			</div>
		</div>
	) : (
		<div data-testid='WrittenReviewForm-component'>
			<div>
				<h2 className='text-base leading-7 font-semibold text-gray-900'>
					{t('written-review.title')}
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-600'>
					{t('written-review.policy-1')}
				</p>
				<ol className='mt-1 list-decimal pl-4 text-sm leading-6 text-gray-600'>
					<li>{t('written-review.policy-2')}</li>
					<li>{t('written-review.policy-3')}</li>
					<li>{t('written-review.policy-4')}</li>
				</ol>
			</div>
			<LargeTextInput
				title={`${t('review-form.review')} ${t('review-form.optional')}`}
				setValue={(str: string) => dispatch(updateReview(str))}
				id='review'
				placeHolder={t('review-form.optional')}
				testid='create-review-form-text-1'
				limitText={t('review-form.limit', {
					length: review.length,
				})}
				length={2000}
				value={review}
			/>
			<div className='flex w-full justify-end pt-2'>
				<Button
					disabled={false}
					onClick={() => {
						posthog.capture('create_review_written_review')
						setShowPreview(true)
						setReviewOpen(false)
					}}
				>
					{t('written-review.preview-review')}
				</Button>
			</div>
		</div>
	)
}

export default WrittenReviewForm
