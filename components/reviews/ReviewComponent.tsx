import { classNames } from '@/util/helpers/helper-functions'
import { UserReview } from '@/util/interfaces/interfaces'
import { useUser } from '@auth0/nextjs-auth0/client'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { FlagIcon, PencilIcon } from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import AdsComponent, { AD_UNITS } from '../adsense/Adsense'
import RatingStars from '../ui/RatingStars'
import Tooltip from '../ui/Tooltip'
import ButtonLight from '../ui/button-light'

interface IProps {
	review: UserReview
	i: number
	handleReport: (review: UserReview) => void
	handleUserEdit?: (review: UserReview) => void
	handleUserDelete?: (review: UserReview) => void
	landlordPage?: boolean
}

const ReviewComponent = ({
	review,
	i,
	handleReport,
	handleUserEdit,
	handleUserDelete,
	landlordPage = false,
}: IProps) => {
	const { user } = useUser()
	const t = useTranslations()
	const date = new Date(review.date_added).toLocaleDateString()
	const [showEditOptions, setShowEditOptions] = useState(false)
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

	const hideWrittenReview = !review.review || review.review.length <= 1

	const isSuspicious = review.suspicious_reason !== null

	return (
		<div key={review.id} data-testid={`review-${review.id}`}>
			<div>
				{i > 0 && i % 20 === 0 && (
					<AdsComponent slot={AD_UNITS.REVIEW_FEED} type='in-feed' />
				)}
			</div>
			<div className='flex flex-col rounded-lg border border-gray-100 shadow lg:flex-row lg:gap-x-4'>
				<div className='flex flex-col items-center bg-gray-50 p-2 lg:max-w-[275px] lg:min-w-[275px] lg:flex-col'>
					<div className='flex w-full flex-row justify-between'>
						{!landlordPage ? (
							<Link
								href={`/landlord/${encodeURIComponent(review.landlord)}`}
								className='col mb-4 flex w-full cursor-pointer flex-col text-lg wrap-break-word hover:underline lg:mb-2 lg:items-center'
							>
								<h6 className='text-center'>{review.landlord}</h6>
								<p className='text-center text-sm'>{t('reviews.read-all')}</p>
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
					<div className='mt-4 flex flex-row justify-start space-x-1'>
						<ButtonLight onClick={() => handleReport(review)}>
							<FlagIcon className='text-red-700' width={20} />
						</ButtonLight>
						{review.has_user_code || user?.role === 'ADMIN' ? (
							<ButtonLight
								onClick={() => setShowEditOptions(!showEditOptions)}
								testid={`review-edit-toggle-${review.id}`}
								label='Edit Menu'
								type='button'
							>
								<PencilIcon className='text-black-700' width={20} />
							</ButtonLight>
						) : null}
					</div>

					{handleUserDelete && handleUserEdit && showEditOptions ? (
						<>
							<div className='mt-4 w-full'>
								<ButtonLight onClick={() => handleUserDelete(review)}>
									{t('user-delete.remove')}
								</ButtonLight>
							</div>
							<div className='mt-4 w-full'>
								<ButtonLight
									onClick={() => handleUserEdit(review)}
									testid={`review-edit-${review.id}`}
									type='button'
									label={t('user-edit.edit')}
								>
									{t('user-edit.edit')}
								</ButtonLight>
							</div>
						</>
					) : null}
				</div>
				<div
					className={classNames(
						'flex w-full grow flex-col gap-3 p-4 lg:flex-row lg:pr-4',
					)}
				>
					<div
						className={classNames(
							'flex h-full justify-between',
							hideWrittenReview
								? 'grow flex-row'
								: 'flex-row py-4 lg:max-w-[200px] lg:min-w-[200px] lg:flex-col',
						)}
					>
						<div
							className={classNames(
								'flex flex-row flex-wrap items-center gap-3',
								hideWrittenReview
									? 'grow justify-center lg:flex-wrap'
									: 'justify-between',
							)}
						>
							{ratings.map((rating) => {
								return (
									<div
										className={classNames(
											'flex flex-col lg:items-center lg:text-center',
											hideWrittenReview ? 'lg:w-[130px]' : 'lg:w-full',
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
									<p>{`${t('reviews.rent')}${review.rent}`}</p>
									<p className='text-xs'>{t('reviews.local')}</p>
								</div>
							)}
						</div>
					</div>
					<div className='flex grow flex-row justify-between'>
						<div className='grow'>
							{hideWrittenReview ? null : (
								<div className='flex h-full w-full flex-col gap-3'>
									<p>{t('reviews.review')}</p>

									<p className='space-y-6 text-sm wrap-break-word hyphens-auto text-gray-500'>
										{review.review}
									</p>
								</div>
							)}
							{review.admin_edited ? (
								<p className='text-xs text-red-400'>
									{user?.role === 'ADMIN'
										? review.moderation_reason
										: t.rich('reviews.moderated', {
												link: (chunks) => (
													<Link href='/about#moderation' className='underline'>
														{chunks}
													</Link>
												),
											})}
								</p>
							) : null}
						</div>
						{isSuspicious && (
							<div>
								<Tooltip
									text={
										user?.role === 'ADMIN'
											? review.suspicious_reason
											: t('reviews.suspicious')
									}
									position='left'
								>
									<ExclamationCircleIcon className='h-6 w-6 text-orange-600' />
								</Tooltip>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ReviewComponent
