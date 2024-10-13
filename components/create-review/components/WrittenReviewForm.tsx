import Button from '@/components/ui/button'
import LargeTextInput from '@/components/ui/LargeTextInput'
import { useTranslation } from 'react-i18next'

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
	const { t } = useTranslation('create')
	return !reviewOpen ? (
		<div className='flex w-full flex-row items-center justify-between transition-all duration-500'>
			<div className='flex flex-col gap-2'>
				<p className='text-xs'>Review</p>
				<p className='text-md'>{review}</p>
			</div>
			<div>
				<Button
					onClick={() => {
						setReviewOpen(true)
					}}
				>
					Edit
				</Button>
			</div>
		</div>
	) : (
		<div>
			<div>
				<h5 className='font-montserrat-bold text-lg'>Reminder for Reviews</h5>
				<p>
					When sharing your experience, please adhere to our moderation policy.
					Your feedback helps future tenants make informed decisions, so keep
					your reviews relevant and respectful.
					<br />
					We prohibit threats, hate speech, and any lewd or discriminatory
					language. While we allow landlord names for transparency, do not
					include addresses, phone numbers, or personal information.
					<br />
					Reviews that violate these guidelines may be amended or removed at our
					discretion. We appreciate your cooperation in maintaining a safe and
					informative community!
				</p>
			</div>
			<LargeTextInput
				title={t('create-review.review-form.review')}
				setValue={(str: string) => handleTextChange(str, 'review')}
				id='review'
				placeHolder=''
				testid='create-review-form-text-1'
				limitText={t('create-review.review-form.limit', {
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
					Preview Review
				</Button>
			</div>
		</div>
	)
}

export default WrittenReviewForm
