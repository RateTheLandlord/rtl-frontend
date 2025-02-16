import { useTranslations } from 'next-intl'
import { classNames } from '@/util/helpers/helper-functions'
import RatingStars from '@/components/ui/RatingStars'

interface IProps {
	review: string
	health: number
	respect: number
	privacy: number
	repair: number
	stability: number
	landlord: string
	city: string
	state: string
	country_code: string
	rent?: number | null
	zip: string
}

const ReviewPreview = ({
	review,
	health,
	respect,
	privacy,
	stability,
	landlord,
	repair,
	city,
	state,
	country_code,
	rent,
	zip,
}: IProps) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const t = useTranslations('reviews')

	const ratings = [
		{
			title: t('health'),
			rating: health,
			testid: 'HealthReviewPreviewRating',
		},
		{
			title: t('respect'),
			rating: respect,
			testid: 'RespectReviewPreviewRating',
		},
		{
			title: t('privacy'),
			rating: privacy,
			testid: 'PrivacyReviewPreviewRating',
		},
		{
			title: t('repair'),
			rating: repair,
			testid: 'RepairReviewPreviewRating',
		},
		{
			title: t('stability'),
			rating: stability,
			testid: 'StabilityReviewPreviewRating',
		},
	]
	let totalReview = 0
	for (let i = 0; i < ratings.length; i++) {
		totalReview += Number(ratings[i].rating)
	}
	const avgRating = Math.round(totalReview / ratings.length)
	return (
		<div className='max-w-[1000px]' data-testid='ReviewPreview-component'>
			<div className='flex flex-col rounded-lg border border-gray-100 shadow lg:flex-row lg:gap-x-8'>
				<div className='flex flex-col items-center bg-gray-50 p-2 lg:max-w-[275px] lg:min-w-[250px] lg:flex-col'>
					<div className='flex flex-col items-center justify-center'>
						<div className='flex w-full flex-row justify-between'>
							<div className='col mb-4 flex w-full flex-col text-lg break-words lg:mb-2 lg:items-center'>
								<h6
									className='text-center'
									data-testid='ReviewPreview-Landlord'
								>
									{landlord}
								</h6>
							</div>
						</div>

						<RatingStars testid={'ReviewPreview-Rating'} value={avgRating} />
					</div>
					<div className={classNames('flex flex-col lg:hidden', 'text-end')}>
						<div
							className='w-full text-gray-500 lg:mt-2 lg:ml-0 lg:border-0 lg:pl-0'
							data-testid='ReviewPreview-Location'
						>{`${city}, ${state}, ${
							country_code === 'GB' ? 'UK' : country_code
						}, ${zip}`}</div>
					</div>

					<div className='hidden flex-col text-center lg:flex'>
						<div className='w-full text-gray-500 lg:mt-2 lg:ml-0 lg:border-0 lg:pl-0'>{`${city}, ${state}, ${
							country_code === 'GB' ? 'UK' : country_code
						}, ${zip}`}</div>
					</div>
				</div>
				<div className='flex flex-col p-4 lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8'>
					<div className='flex h-full flex-col justify-between'>
						<div className='flex flex-row flex-wrap items-center gap-3 xl:col-span-1'>
							{ratings.map((rating) => {
								return (
									<div key={rating.title}>
										<p>{rating.title}</p>
										<RatingStars testid={rating.testid} value={rating.rating} />
									</div>
								)
							})}
							{rent && (
								<div className='flex w-full flex-col'>
									<p
										className='w-full'
										data-testid='ReviewPreviewRent'
									>{`${t('rent')}${rent}`}</p>
									<p className='text-xs'>{t('local')}</p>
								</div>
							)}
						</div>
					</div>

					<div className='mt-4 flex h-full flex-col justify-between lg:mt-6 xl:col-span-2 xl:mt-0'>
						<div>
							<p>{t('review')}</p>

							<p
								className='mt-3 space-y-6 text-sm break-words text-gray-500'
								data-testid='WrittenReviewPreview'
							>
								{review}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ReviewPreview
