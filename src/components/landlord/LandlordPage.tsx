'use client'

import { useEffect, useMemo, useState } from 'react'
import LandlordInfo from './LandlordInfo'
import OtherLandlordInfo from './OtherLandlord'
import LandlordBanner from './LandlordBanner'
import { useTranslations } from 'next-intl'
import { SortOptions, SuspiciousLandlord } from '@/util/interfaces/Interfaces'
import Spinner from '../ui/Spinner'
import { sortOptions } from '@/util/helpers/filterOptions'
import SortList from '../reviews/ui/SortList'
import ReviewTable from '../reviews/ReviewTable'
import useSWR from 'swr'
import { fetcher } from '@/util/helpers/fetcher'
import AdsComponent, { AD_UNITS } from '../adsense/Adsense'
import { ILandlordReviews } from '@/lib/review/types/Queries'
import Button from '../ui/Button'

const filteredSortOptions = sortOptions.slice(2)

interface IProps {
	landlord: string
	data: ILandlordReviews
}

const LandlordPage = ({ landlord, data }: IProps) => {
	const t = useTranslations('reviews')
	const [bannerOpen, setBannerOpen] = useState<boolean>(false)
	const [showSuspiciousReviews, setShowSuspiciousReviews] = useState(false)

	const [sortState, setSortState] = useState<SortOptions | null>(
		filteredSortOptions[0],
	)

	const { data: suspiciousLandlord } = useSWR<SuspiciousLandlord | boolean>(
		`/api/suspicious-landlords/get-suspicious-landlord?landlord=${encodeURIComponent(
			landlord,
		)}`,
		fetcher,
	)

	useEffect(() => {
		if (suspiciousLandlord) {
			setBannerOpen(true)
			setSortState(filteredSortOptions[1])
		} else {
			setBannerOpen(false)
		}
	}, [suspiciousLandlord])

	const sortedReviews = useMemo(() => {
		const reviews = [...data.reviews]
		const sortByDate = (
			left: (typeof reviews)[number],
			right: (typeof reviews)[number],
		) => {
			const dateDifference =
				new Date(left.date_added).getTime() -
				new Date(right.date_added).getTime()
			return dateDifference || Number(left.id ?? 0) - Number(right.id ?? 0)
		}
		const rating = (review: (typeof reviews)[number]) =>
			review.health +
			review.privacy +
			review.repair +
			review.respect +
			review.stability

		switch (sortState?.value) {
			case 'old':
				return reviews.sort(sortByDate)
			case 'high':
				return reviews.sort(
					(left, right) =>
						rating(right) - rating(left) || -sortByDate(left, right),
				)
			case 'low':
				return reviews.sort(
					(left, right) =>
						rating(left) - rating(right) || -sortByDate(left, right),
				)
			case 'new':
			default:
				return reviews.sort((left, right) => -sortByDate(left, right))
		}
	}, [data.reviews, sortState?.value])

	if (!data.reviews.length) return <Spinner />

	const filteredReviews = sortedReviews.filter(
		(review) => review.suspicious_reason === null,
	)

	return (
		<>
			<div className='mt-3 flex w-full justify-center'>
				<div className='mx-auto flex max-w-full flex-col gap-3 px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
					<AdsComponent slot={AD_UNITS.LANDLORD} />
					{bannerOpen ? (
						<LandlordBanner
							landlord={suspiciousLandlord as SuspiciousLandlord}
						/>
					) : (
						false
					)}
					<LandlordInfo name={landlord} data={data} />
					<div className='flex w-full justify-between py-2'>
						<SortList
							state={sortState}
							setState={setSortState}
							options={filteredSortOptions}
							name={t('sort')}
						/>
						{filteredReviews.length > 0 && (
							<Button onClick={() => setShowSuspiciousReviews((p) => !p)}>
								{showSuspiciousReviews
									? t('hide-suspicious')
									: t('show-suspicious')}
							</Button>
						)}
					</div>
					<div className='flex w-full flex-col gap-3'>
						<ReviewTable
							data={
								showSuspiciousReviews || filteredReviews.length <= 0
									? sortedReviews
									: filteredReviews
							}
							isLoading={false}
							landlordPage={true}
						/>
					</div>
					<OtherLandlordInfo landlord={landlord} />
				</div>
			</div>
		</>
	)
}

export default LandlordPage
