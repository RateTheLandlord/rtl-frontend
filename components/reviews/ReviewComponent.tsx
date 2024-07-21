import Link from 'next/link'
import AdsComponent from '../adsense/Adsense'
import { useTranslation } from 'react-i18next'
import RatingStars from '../ui/RatingStars'
import ButtonLight from '../ui/button-light'
import { FlagIcon } from '@heroicons/react/solid'
import { Review } from '@/util/interfaces/interfaces'
import { useUser } from '@auth0/nextjs-auth0/client'
import { classNames } from '@/util/helpers/helper-functions'

interface IProps {
	review: Review
	i?: number
	handleReport: (review: Review) => void
	handleDelete?: (review: Review) => void
	handleEdit?: (review: Review) => void
	landlordPage?: boolean
}

const ReviewComponent = ({
	review,
	i,
	handleReport,
	handleDelete,
	handleEdit,
	landlordPage = false,
}: IProps) => {
	const { t } = useTranslation('reviews')
	const { user } = useUser()
	const date = new Date(review.date_added).toLocaleDateString()

	const ratings = [
		{ title: t('reviews.health'), rating: review.health },
		{ title: t('reviews.respect'), rating: review.respect },
		{ title: t('reviews.privacy'), rating: review.privacy },
		{ title: t('reviews.repair'), rating: review.repair },
		{ title: t('reviews.stability'), rating: review.stability },
	]
	let totalReview = 0
	for (let i = 0; i < ratings.length; i++) {
		totalReview += Number(ratings[i].rating)
	}
	const avgRating = Math.round(totalReview / ratings.length)
	return (
		<div key={review.id}>
			{i && i % 20 === 0 && i !== 0 ? (
				<AdsComponent
					slot='3829259014'
					format='fluid'
					layoutKey='-gw-3+1f-3d+2z'
				/>
			) : null}
			<div className='flex flex-col rounded-lg border border-gray-100 shadow lg:flex-row lg:gap-x-8'>
				<div className='flex flex-col items-center bg-gray-50 p-2 lg:min-w-[250px] lg:max-w-[275px] lg:flex-col'>
					<div className='flex w-full flex-row justify-between'>
						{!landlordPage ? (
							<Link
								href={`/landlord/${encodeURIComponent(review.landlord)}`}
								className='col mb-4 flex w-full cursor-pointer flex-col break-words text-lg  hover:underline lg:mb-2 lg:items-center'
							>
								<h6 className='text-center'>{review.landlord}</h6>
								<p className='text-center text-sm'>Read all reviews</p>
							</Link>
						) : null}
						<div
							className={classNames(
								'flex flex-col lg:hidden',
								landlordPage ? 'w-full text-center' : 'text-end',
							)}
						>
							<Link
								href={`/cities/${encodeURIComponent(
									review.country_code,
								)}/${encodeURIComponent(review.state)}/${encodeURIComponent(
									review.city,
								)}`}
								className='w-full text-gray-500 hover:underline lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'
							>{`${review.city}, ${review.state}, ${
								review.country_code === 'GB' ? 'UK' : review.country_code
							}, ${review.zip}`}</Link>
							<p className='mb-4 text-gray-500 lg:mb-0 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'>
								{date}
							</p>
						</div>
					</div>

					<RatingStars value={avgRating} />

					<div className='hidden flex-col text-center lg:flex'>
						<Link
							href={`/cities/${encodeURIComponent(
								review.country_code,
							)}/${encodeURIComponent(review.state)}/${encodeURIComponent(
								review.city,
							)}`}
							className='w-full text-gray-500 hover:underline lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'
						>{`${review.city}, ${review.state}, ${
							review.country_code === 'GB' ? 'UK' : review.country_code
						}, ${review.zip}`}</Link>
						<p className='mb-4 text-gray-500 lg:mb-0 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0'>
							{date}
						</p>
					</div>
					<div className='mt-4 flex flex-row justify-start'>
						<ButtonLight onClick={() => handleReport(review)}>
							<FlagIcon className='text-red-700' width={20} />
						</ButtonLight>
					</div>
					{handleDelete && handleEdit && user && user.role === 'ADMIN' ? (
						<>
							<div className='mt-4 w-full'>
								<ButtonLight onClick={() => handleDelete(review)}>
									Remove Review
								</ButtonLight>
							</div>
							<div className='mt-4 w-full'>
								<ButtonLight onClick={() => handleEdit(review)}>
									Edit Review
								</ButtonLight>
							</div>
						</>
					) : null}
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
							{review.rent && (
								<div className='flex w-full flex-col'>
									<p className='w-full'>{`${t('reviews.rent')}${
										review.rent
									}`}</p>
									<p className='text-xs'>{t('reviews.local')}</p>
								</div>
							)}
						</div>
					</div>

					<div className='mt-4 flex h-full flex-col justify-between lg:mt-6 xl:col-span-2 xl:mt-0'>
						<div>
							<p>{t('reviews.review')}</p>

							<p className='mt-3 space-y-6 text-sm text-gray-500'>
								{review.review}
							</p>
						</div>
						{review.admin_edited ? (
							<p className='text-xs text-red-400'>{`${t('reviews.edited')} ${
								review.moderation_reason
									? `Reason: ${review.moderation_reason}`
									: ''
							}`}</p>
						) : null}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ReviewComponent
