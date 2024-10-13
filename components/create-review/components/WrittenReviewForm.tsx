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
		<>
			<div>
				<h2 className='text-base font-semibold leading-7 text-gray-900'>
					Written Review
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-600'>
					Please follow our moderation policy:
				</p>
				<ol className='mt-1 list-decimal pl-4 text-sm leading-6 text-gray-600'>
					<li>
						Keep reviews civil and avoid including personal information such as
						addresses or phone numbers.
					</li>
					<li>
						Avoid sharing personal details about yourself or your landlord that
						are not relevant to your rental experience.
					</li>
					<li>
						Inappropriate content may be removed. Thank you for maintaining a
						safe and helpful community!
					</li>
				</ol>
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
		</>
	)
}

export default WrittenReviewForm
