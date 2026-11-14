/* eslint-disable no-case-declarations */
import { useEffect, useState } from 'react'
import LandlordInfo from './LandlordInfo'
import OtherLandlordInfo from './OtherLandlord'
import LandlordBanner from './LandlordBanner'
import { useTranslations } from 'next-intl'
import {
	SortOptions,
	SuspiciousLandlord,
	UserReview,
} from '@/util/interfaces/interfaces'
import Spinner from '../ui/Spinner'
import { sortOptions } from '@/util/helpers/filter-options'
import SortList from '../reviews/ui/sort-list'
import ReviewTable from '../reviews/review-table'
import useSWR from 'swr'
import { fetcher } from '@/util/helpers/fetcher'
import AdsComponent, { AD_UNITS } from '../adsense/Adsense'
import { ILandlordReviews } from '@/lib/review/types/Queries'
import Button from '../ui/button'

const filteredSortOptions = sortOptions.slice(2)

interface IProps {
	landlord: string
	data: ILandlordReviews
}

const LandlordPage = ({ landlord, data }: IProps) => {
	const t = useTranslations('reviews')
	const [bannerOpen, setBannerOpen] = useState<boolean>(false)
	const [sortedReviews, setSortedReviews] = useState<UserReview[]>([])
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

	useEffect(() => {
		switch (sortState?.value) {
			case 'new':
				const sortedOld = data.reviews.sort(
					(a, b) => Number(b.id) - Number(a.id),
				)
				setSortedReviews([...sortedOld])
				break
			case 'old':
				const sortedNew = data.reviews.sort(
					(a, b) => Number(a.id) - Number(b.id),
				)
				setSortedReviews([...sortedNew])
				break
			case 'high':
				const sortedHigh = data.reviews.sort((a, b) => {
					const aTotal =
						a.health + a.privacy + a.repair + a.respect + a.stability
					const bTotal =
						b.health + b.privacy + b.repair + b.respect + b.stability

					return Number(bTotal) - Number(aTotal)
				})
				setSortedReviews([...sortedHigh])
				break
			case 'low':
				const sortedLow = data.reviews.sort((a, b) => {
					const aTotal =
						a.health + a.privacy + a.repair + a.respect + a.stability
					const bTotal =
						b.health + b.privacy + b.repair + b.respect + b.stability

					return Number(aTotal) - Number(bTotal)
				})
				setSortedReviews([...sortedLow])
				break
		}
	}, [sortState, data.reviews])

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
