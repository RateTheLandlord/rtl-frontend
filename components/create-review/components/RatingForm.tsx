/**
 * @jest-environment jsdom
 */
import Button from '@/components/ui/button'
import RatingsRadio from '../ratings-radio'
import RatingStars from '@/components/ui/RatingStars'
import { useTranslations } from 'next-intl'

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
	const t = useTranslations('createreview')
	return !ratingsOpen ? (
		<div className='flex w-full flex-row items-center justify-between transition-all duration-500'>
			<div className='flex flex-col gap-2'>
				<p className='text-xs'>{t('ratings-form.title')}</p>
				<div className='flex w-full flex-row flex-wrap gap-6'>
					{ratings.map((rating) => {
						return (
							<div key={rating.title} className='flex flex-col items-center'>
								<p>{rating.title}</p>
								<RatingStars
									testid={rating.title + 'RatingStars-component'}
									value={rating.rating}
								/>
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
					{t('edit')}
				</Button>
			</div>
		</div>
	) : (
		<>
			<div className='mb-3' data-testid='RatingForm-component'>
				<h2 className='text-base leading-7 font-semibold text-gray-900'>
					{t('ratings-form.title')}
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-600'>
					{t('review-form.rate-title')}
				</p>
			</div>
			<div className='flex flex-col gap-2'>
				<RatingsRadio
					title={t('review-form.repair')}
					rating={repair}
					setRating={setRepair}
					tooltip={t('review-form.repair_description')}
					testid='RepairRatingsRadio-component'
				/>

				<RatingsRadio
					title={t('review-form.health')}
					rating={health}
					setRating={setHealth}
					tooltip={t('review-form.health_description')}
					testid='HealthRatingsRadio-component'
				/>

				<RatingsRadio
					title={t('review-form.stability')}
					rating={stability}
					setRating={setStability}
					tooltip={t('review-form.stability_description')}
					testid='StabilityRatingsRadio-component'
				/>

				<RatingsRadio
					title={t('review-form.privacy')}
					rating={privacy}
					setRating={setPrivacy}
					tooltip={t('review-form.privacy_description')}
					testid='PrivacyRatingsRadio-component'
				/>

				<RatingsRadio
					title={t('review-form.respect')}
					rating={respect}
					setRating={setRespect}
					tooltip={t('review-form.respect_description')}
					testid='RespectRatingsRadio-component'
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
					{t('continue')}
				</Button>
			</div>
		</>
	)
}

export default RatingForm
