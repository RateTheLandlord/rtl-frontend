/**
 * @jest-environment jsdom
 */
import RatingsRadio from '../ratings-radio'
import { useTranslations } from 'next-intl'
import TextInput from '@/components/ui/TextInput'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateHealth,
	updatePrivacy,
	updateRepair,
	updateRespect,
	updateStability,
} from '@/redux/review/reviewSlice'
import { updateRent } from '@/redux/review/reviewSlice'

const RatingForm = () => {
	// Add ", rent" to this
	const { repair, health, stability, privacy, respect, rent } = useAppSelector(
		(state) => state.review,
	)
	const dispatch = useAppDispatch()
	const t = useTranslations('createreview')
	return (
		<>
			<div
				data-testid='rating-form-grid'
				className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'
			>
				<RatingsRadio
					title={t('review-form.health')}
					rating={health}
					setRating={(rating) => dispatch(updateHealth(rating))}
					tooltip={t('review-form.health_description')}
					testid='HealthRatingsRadio-component'
				/>
				<RatingsRadio
					title={t('review-form.repair')}
					rating={repair}
					setRating={(rating) => dispatch(updateRepair(rating))}
					tooltip={t('review-form.repair_description')}
					testid='RepairRatingsRadio-component'
				/>
				<RatingsRadio
					title={t('review-form.respect')}
					rating={respect}
					setRating={(rating) => dispatch(updateRespect(rating))}
					tooltip={t('review-form.respect_description')}
					testid='RespectRatingsRadio-component'
				/>
				<RatingsRadio
					title={t('review-form.stability')}
					rating={stability}
					setRating={(rating) => dispatch(updateStability(rating))}
					tooltip={t('review-form.stability_description')}
					testid='StabilityRatingsRadio-component'
				/>
				<RatingsRadio
					title={t('review-form.privacy')}
					rating={privacy}
					setRating={(rating) => dispatch(updatePrivacy(rating))}
					tooltip={t('review-form.privacy_description')}
					testid='PrivacyRatingsRadio-component'
				/>
				<TextInput
					id='rent'
					data-testid='rent-textinput'
					type='number'
					title={t('review-form.rent')}
					placeHolder={t('review-form.rent')}
					value={rent}
					setValue={(str: string) => dispatch(updateRent(Number(str)))}
					testid='create-review-form-rent-1'
					backgroundColor='white'
					width='100%'
				/>
			</div>
		</>
	)
}

export default RatingForm
