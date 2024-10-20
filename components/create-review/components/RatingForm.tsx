import Button from '@/components/ui/button'
import RatingsRadio from '../ratings-radio'
import { useTranslation } from 'react-i18next'
import RatingStars from '@/components/ui/RatingStars'

interface IProps {
	ratingsOpen: boolean
	ratings: {
		title: string
		rating: number
	}[]
	setRatingsOpen: (bool: boolean) => void
	repair: number
	setRepair: (num: number) => void
	health: number
	setHealth: (num: number) => void
	stability: number
	setStability: (num: number) => void
	privacy: number
	setPrivacy: (num: number) => void
	respect: number
	setRespect: (num: number) => void
	setShowReviewForm: (bool: boolean) => void
	setReviewOpen: (bool: boolean) => void
}

const RatingForm = ({
	ratingsOpen,
	ratings,
	setRatingsOpen,
	repair,
	setRepair,
	health,
	setHealth,
	stability,
	setStability,
	privacy,
	setPrivacy,
	respect,
	setRespect,
	setShowReviewForm,
	setReviewOpen,
}: IProps) => {
	const { t } = useTranslation('create')
	return !ratingsOpen ? (
		<div className='flex w-full flex-row items-center justify-between transition-all duration-500'>
			<div className='flex flex-col gap-2'>
				<p className='text-xs'>{t('create-review.ratings-form.title')}</p>
				<div className='flex w-full flex-row flex-wrap gap-6'>
					{ratings.map((rating) => {
						return (
							<div key={rating.title} className='flex flex-col items-center'>
								<p>{rating.title}</p>
								<RatingStars value={rating.rating} />
							</div>
						)
					})}
				</div>
			</div>
			<div>
				<Button
					onClick={() => {
						setRatingsOpen(true)
					}}
				>
					{t('create-review.edit')}
				</Button>
			</div>
		</div>
	) : (
		<>
			<div className='mb-3'>
				<h2 className='text-base font-semibold leading-7 text-gray-900'>
					{t('create-review.ratings-form.title')}
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-600'>
					{t('create-review.review-form.rate-title')}
				</p>
			</div>
			<div className='flex flex-col gap-2'>
				<RatingsRadio
					title={t('create-review.review-form.repair')}
					rating={repair}
					setRating={setRepair}
					tooltip={t('create-review.review-form.repair_description')}
				/>

				<RatingsRadio
					title={t('create-review.review-form.health')}
					rating={health}
					setRating={setHealth}
					tooltip={t('create-review.review-form.health_description')}
				/>

				<RatingsRadio
					title={t('create-review.review-form.stability')}
					rating={stability}
					setRating={setStability}
					tooltip={t('create-review.review-form.stability_description')}
				/>

				<RatingsRadio
					title={t('create-review.review-form.privacy')}
					rating={privacy}
					setRating={setPrivacy}
					tooltip={t('create-review.review-form.privacy_description')}
				/>

				<RatingsRadio
					title={t('create-review.review-form.respect')}
					rating={respect}
					setRating={setRespect}
					tooltip={t('create-review.review-form.respect_description')}
				/>
			</div>
			<div className='flex w-full justify-end pt-2'>
				<Button
					onClick={() => {
						setShowReviewForm(true)
						setRatingsOpen(false)
						setReviewOpen(true)
					}}
				>
					{t('create-review.continue')}
				</Button>
			</div>
		</>
	)
}

export default RatingForm
