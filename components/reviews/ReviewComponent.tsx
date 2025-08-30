import Link from 'next/link'
import AdsComponent from '../adsense/Adsense'
import { useTranslations } from 'next-intl'
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
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const t = useTranslations('reviews')
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { user } = useUser()
	const date = new Date(review.date_added).toLocaleDateString()
	const ratings = [
		{ title: t('health'), rating: review.health },
		{ title: t('respect'), rating: review.respect },
		{ title: t('privacy'), rating: review.privacy },
		{ title: t('repair'), rating: review.repair },
		{ title: t('stability'), rating: review.stability },
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
			<div className='flex flex-col rounded-lg border border-gray-100 shadow lg:flex-row lg:gap-x-4'>
				<div className='flex flex-col items-center bg-gray-50 p-2 lg:max-w-[275px] lg:min-w-[275px] lg:flex-col'>
					<div className='flex w-full flex-row justify-between'>
						{!landlordPage ? (
							<Link
								href={`/landlord/${encodeURIComponent(review.landlord)}`}
								className='col mb-4 flex w-full cursor-pointer flex-col text-lg break-words hover:underline lg:mb-2 lg:items-center'
							>
								<h6 className='text-center'>{review.landlord}</h6>
								<p className='text-center text-sm'>{t('read-all')}</p>
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
								className='w-full text-gray-500 hover:underline lg:mt-2 lg:ml-0 lg:border-0 lg:pl-0'
							>{`${review.city}, ${review.state}, ${
								review.country_code === 'GB' ? 'UK' : review.country_code
							}, ${review.zip}`}</Link>
							<p className='mb-4 text-gray-500 lg:mt-2 lg:mb-0 lg:ml-0 lg:border-0 lg:pl-0'>
								{date}
							</p>
						</div>
					</div>

					<RatingStars testid='reviewcomponentrating' value={avgRating} />

					<div className='hidden flex-col text-center lg:flex lg:w-[250px]'>
						<Link
							href={`/cities/${encodeURIComponent(
								review.country_code,
							)}/${encodeURIComponent(review.state)}/${encodeURIComponent(
								review.city,
							)}`}
							className='w-full text-gray-500 hover:underline lg:mt-2 lg:ml-0 lg:border-0 lg:pl-0'
						>{`${review.city}, ${review.state}, ${
							review.country_code === 'GB' ? 'UK' : review.country_code
						}, ${review.zip}`}</Link>
						<p className='mb-4 text-gray-500 lg:mt-2 lg:mb-0 lg:ml-0 lg:border-0 lg:pl-0'>
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
				<div
					className={classNames(
						'flex flex-col gap-3 p-4 lg:flex-row lg:pr-4',
						review.review.length < 1 ? 'grow' : '',
					)}
				>
					<div
						className={classNames(
							'flex h-full justify-between',
							review.review.length < 1
								? 'grow flex-row'
								: 'flex-row py-4 lg:max-w-[200px] lg:min-w-[200px] lg:flex-col',
						)}
					>
						<div
							className={classNames(
								'flex flex-row flex-wrap items-center gap-3',
								review.review.length < 1
									? 'grow justify-center lg:flex-wrap'
									: 'justify-between',
							)}
						>
							{ratings.map((rating) => {
								return (
									<div
										className={classNames(
											'flex flex-col lg:items-center lg:text-center',
											review.review.length < 1 ? 'lg:w-[130px]' : 'lg:w-full',
										)}
										key={rating.title}
									>
										<p>{rating.title}</p>
										<RatingStars
											testid='reviewcomponentrating2'
											value={rating.rating}
										/>
									</div>
								)
							})}
							{review.rent && (
								<div className='flex w-full flex-col lg:items-center'>
									<p>{`${t('rent')}${review.rent}`}</p>
									<p className='text-xs'>{t('local')}</p>
								</div>
							)}
						</div>
					</div>

					<div>
						{review.review.length < 1 ? null : (
							<div className='flex h-full flex-col justify-between gap-3'>
								<div>
									<p>{t('review')}</p>

									<p className='space-y-6 text-sm break-words hyphens-auto text-gray-500'>
										{review.review}
									</p>
								</div>
							</div>
						)}
						{review.admin_edited ? (
							<p className='text-xs text-red-400'>{`${t('edited')} ${
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
