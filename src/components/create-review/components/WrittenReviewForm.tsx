import LargeTextInput from '@/components/ui/LargeTextInput'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateReview } from '@/redux/review/reviewSlice'
import { useTranslations } from 'next-intl'

const WrittenReviewForm = () => {
	const t = useTranslations('createreview')
	const { review } = useAppSelector((state) => state.review)
	const dispatch = useAppDispatch()
	return (
		<div data-testid='WrittenReviewForm-component'>
			<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
				<LargeTextInput
					title={`${t('review-form.review')}`}
					setValue={(str: string) => dispatch(updateReview(str))}
					id='review'
					placeHolder={''}
					testid='create-review-form-text-1'
					limitText={t('review-form.limit', {
						length: review.length,
					})}
					length={1000}
					value={review}
					backgroundColor='white'
				/>
				<div className='flex flex-col justify-end'>
					<h2 className='text-primary-900 mt-1 text-base leading-7 font-semibold'>
						{t('written-review.title')}
					</h2>
					<p className='text-primary-600 w-full text-sm leading-6 lg:w-2/3'>
						{t('written-review.policy-1')}
					</p>
				</div>
			</div>
		</div>
	)
}

export default WrittenReviewForm
