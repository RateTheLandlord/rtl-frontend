import { useEffect, useState } from 'react'
import ReportModal from '../reviews/report-modal'
import LandlordInfo from './LandlordInfo'
import OtherLandlordInfo from './OtherLandlord'
import LandlordBanner from './LandlordBanner'
import { useTranslation } from 'react-i18next'
import { Review, SuspiciousLandlord } from '@/util/interfaces/interfaces'
import Spinner from '../ui/Spinner'
import { sortOptions } from '@/util/helpers/filter-options'
import SortList from '../reviews/ui/sort-list'
import { ILandlordReviews } from '@/lib/review/review'
import ReviewComponent from '../reviews/ReviewComponent'
import useSWR from 'swr'
import { fetcher } from '@/util/helpers/fetcher'

const filteredSortOptions = sortOptions.slice(2)

interface IProps {
	landlord: string
	data: ILandlordReviews
}

const LandlordPage = ({ landlord, data }: IProps) => {
	const { t } = useTranslation('reviews')
	const [reportOpen, setReportOpen] = useState<boolean>(false)
	const [bannerOpen, setBannerOpen] = useState<boolean>(false)
	const [sortedReviews, setSortedReviews] = useState<Array<Review>>([])

	const [sortState, setSortState] = useState(filteredSortOptions[0])

	const [selectedReview, setSelectedReview] = useState<Review | undefined>()

	const { data: suspiciousLandlord } = useSWR<SuspiciousLandlord | boolean>(
		`/api/suspicious-landlords/get-suspicious-landlord?landlord=${encodeURIComponent(
			landlord,
		)}`,
		fetcher,
	)

	if (!data.reviews.length) return <Spinner />

	useEffect(() => {
		if (suspiciousLandlord) {
			setBannerOpen(true)
		} else {
			setBannerOpen(false)
		}
	}, [suspiciousLandlord])

	const handleReport = (review: Review) => {
		setSelectedReview(review)
		setReportOpen(true)
	}

	useEffect(() => {
		switch (sortState.value) {
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

	return (
		<>
			<ReportModal
				isOpen={reportOpen}
				setIsOpen={setReportOpen}
				selectedReview={selectedReview}
			/>
			<div className='mt-10 flex w-full justify-center'>
				<div className='mx-auto flex max-w-2xl flex-col gap-3 px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
					{bannerOpen ? (
						<LandlordBanner
							landlord={suspiciousLandlord as SuspiciousLandlord}
						/>
					) : (
						false
					)}
					<LandlordInfo name={landlord} data={data} />
					<div className='flex w-full justify-start py-2'>
						<SortList
							state={sortState}
							setState={setSortState}
							options={filteredSortOptions}
							name={t('reviews.sort')}
						/>
					</div>
					<div className='flex w-full flex-col gap-3'>
						{sortedReviews.map((review) => {
							return (
								<ReviewComponent
									key={review.id}
									review={review}
									handleReport={handleReport}
									landlordPage={true}
								/>
							)
						})}
					</div>

					<OtherLandlordInfo landlord={landlord} />
				</div>
			</div>
		</>
	)
}

export default LandlordPage
