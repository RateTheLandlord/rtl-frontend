import { useTranslation } from 'react-i18next'
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
	const { t } = useTranslation('reviews')

	const ratings = [
		{ title: t('reviews.health'), rating: health },
		{ title: t('reviews.respect'), rating: respect },
		{ title: t('reviews.privacy'), rating: privacy },
		{ title: t('reviews.repair'), rating: repair },
		{ title: t('reviews.stability'), rating: stability },
	]
	let totalReview = 0
	for (let i = 0; i < ratings.length; i++) {
		totalReview += Number(ratings[i].rating)
	}
	const avgRating = Math.round(totalReview / ratings.length)
	return (
		<div className='max-w-[1000px]'>
			<div className='flex flex-col rounded-lg border border-gray-100 shadow lg:flex-row lg:gap-x-8'>
				<div className='flex flex-col items-center bg-gray-50 p-2 lg:min-w-[250px] lg:max-w-[275px] lg:flex-col'>
					<div className='flex w-full flex-row justify-between'>
						<div className='col mb-4 flex w-full cursor-pointer flex-col break-words text-lg  hover:underline lg:mb-2 lg:items-center'>
							<h6 className='text-center'>{landlord}</h6>
						</div>
						<div className={classNames('flex flex-col lg:hidden', 'text-end')}>
							<div className='w-full text-gray-500 hover:underline lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'>{`${city}, ${state}, ${
								country_code === 'GB' ? 'UK' : country_code
							}, ${zip}`}</div>
						</div>
					</div>

					<RatingStars value={avgRating} />

					<div className='hidden flex-col text-center lg:flex'>
						<div className='w-full text-gray-500 hover:underline lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'>{`${city}, ${state}, ${
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
										<RatingStars value={rating.rating} />
									</div>
								)
							})}
							{rent && (
								<div className='flex w-full flex-col'>
									<p className='w-full'>{`${t('reviews.rent')}${rent}`}</p>
									<p className='text-xs'>{t('reviews.local')}</p>
								</div>
							)}
						</div>
					</div>

					<div className='mt-4 flex h-full flex-col justify-between lg:mt-6 xl:col-span-2 xl:mt-0'>
						<div>
							<p>{t('reviews.review')}</p>

							<p className='mt-3 space-y-6 text-sm text-gray-500'>{review}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ReviewPreview
