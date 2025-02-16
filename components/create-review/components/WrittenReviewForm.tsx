import Button from '@/components/ui/button'
import LargeTextInput from '@/components/ui/LargeTextInput'
import { useTranslations } from 'next-intl'

interface IProps {
	reviewOpen: boolean
	review: string
	setReviewOpen: (bool: boolean) => void
	handleTextChange: (str: string, inp: string) => void
	setShowPreview: (bool: boolean) => void
}

const WrittenReviewForm = ({
	reviewOpen,
	review,
	setReviewOpen,
	handleTextChange,
	setShowPreview,
}: IProps) => {
	const t = useTranslations('createreview')
	return !reviewOpen ? (
		<div className='flex w-full flex-row items-center justify-between transition-all duration-500'>
			<div className='flex flex-col gap-2'>
				<p className='text-xs'>{t('written-review.title')}</p>
				<p className='text-md break-words'>{review}</p>
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
				title={t('review-form.review')}
				setValue={(str: string) => handleTextChange(str, 'review')}
				id='review'
				placeHolder=''
				testid='create-review-form-text-1'
				limitText={t('review-form.limit', {
					length: review.length,
				})}
				length={2000}
				value={review}
			/>
			<div className='flex w-full justify-end pt-2'>
				<Button
					disabled={review.length === 0}
					onClick={() => {
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
