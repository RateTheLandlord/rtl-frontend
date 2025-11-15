import { useMemo, useState } from 'react'
import ReportModal from '../reviews/report-modal'
import {
	UserReview as IReview,
	SortOptions,
} from '@/util/interfaces/interfaces'
import ButtonLight from '../ui/button-light'
import { sortOptions } from '@/util/helpers/filter-options'
import EditReviewModal from '../modal/EditReviewModal'
import RemoveReviewModal from '../modal/RemoveReviewModal'
import AdsComponent from '../adsense/Adsense'
import CityFilters from './CityFilters'
import CityMobileFilters from './CityMobileFilters'
import { getZipOptions } from '../reviews/functions'
import { useAppSelector } from '@/redux/hooks'
import { fetchReviews } from '@/util/helpers/fetchReviews'
import CityInfo from './CityInfo'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import AnalyticsComponent from '../analytics/analytics'
import { ICityReviews } from '@/lib/review/types/review'
import { useTranslations } from 'next-intl'
import useInfiniteScroll from '@/util/hooks/useInfiniteScroll'
import ReviewTable from '../reviews/review-table'
import UserEditReviewModal from '../modal/UserEditReviewModal'
import UserRemoveReviewModal from '../modal/UserRemoveReviewModal'

interface IProps {
	city: string
	state: string
	country: string
	data: ICityReviews
}

const CityPage = ({ city, state, country, data }: IProps) => {
	// Localization
	const t = useTranslations('reviews')

	// State
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false)
	const [selectedSort, setSelectedSort] = useState<SortOptions>(sortOptions[2])
	const [editReviewOpen, setEditReviewOpen] = useState(false)
	const [reportOpen, setReportOpen] = useState<boolean>(false)
	const [removeReviewOpen, setRemoveReviewOpen] = useState(false)
	const [selectedReview, setSelectedReview] = useState<IReview | undefined>()
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [userEditMode, setUserEditMode] = useState(false)
	const [userEditReviewOpen, setUserEditReviewOpen] = useState(false)
	const [userRemoveReviewOpen, setUserRemoveReviewOpen] = useState(false)
	const [userKey, setUserKey] = useState('')

	// Redux
	const query = useAppSelector((state) => state.query)
	const { zipFilter, searchFilter } = query

	// Query
	const [queryParams, setQueryParams] = useState({
		sort: selectedSort.value,
		state: state,
		country: country,
		city: city,
		zip: zipFilter?.value || '',
		search: searchFilter || '',
		limit: '25',
	})

	// Filtering and Infinite Loading
	const updateParams = () => {
		const params = {
			sort: selectedSort.value,
			state: state,
			country: country,
			city: city,
			zip: zipFilter?.value || '',
			search: searchFilter || '',
			limit: '25',
		}
		// Only update state if the new params are different from the current ones
		if (JSON.stringify(params) !== JSON.stringify(queryParams)) {
			setQueryParams(params)
		}
	}

	const { reviews, isLoading: isLoadingHook } = useInfiniteScroll<IReview>({
		fetchData: fetchReviews,
		queryParams,
		offset: 150,
	})

	const zipOptions = useMemo(
		() => getZipOptions(data?.zips ?? []),
		[data?.zips],
	)
	return (
		<>
			<ReportModal
				isOpen={reportOpen}
				setIsOpen={setReportOpen}
				selectedReview={selectedReview}
			/>
			{selectedReview && userEditMode ? (
				<>
					<UserEditReviewModal
						selectedReview={selectedReview}
						handleMutate={() => {
							console.log('')
						}}
						setSelectedReview={setSelectedReview}
						userEditReviewOpen={userEditReviewOpen}
						setUserEditReviewOpen={setUserEditReviewOpen}
						userKey={userKey}
						setUserKey={setUserKey}
						setUserEditMode={setUserEditMode}
					/>
					<UserRemoveReviewModal
						selectedReview={selectedReview}
						handleMutate={() => {
							console.log('')
						}}
						setSelectedReview={setSelectedReview}
						userRemoveReviewOpen={userRemoveReviewOpen}
						setUserRemoveReviewOpen={setUserRemoveReviewOpen}
						userKey={userKey}
						setUserKey={setUserKey}
						setUserEditMode={setUserEditMode}
					/>
				</>
			) : null}
			{selectedReview ? (
				<>
					<EditReviewModal
						selectedReview={selectedReview}
						handleMutate={() => {
							console.log('')
						}}
						setEditReviewOpen={setEditReviewOpen}
						editReviewOpen={editReviewOpen}
						setSelectedReview={setSelectedReview}
					/>
					<RemoveReviewModal
						selectedReview={selectedReview}
						handleMutate={() => {
							console.log('')
						}}
						setRemoveReviewOpen={setRemoveReviewOpen}
						removeReviewOpen={removeReviewOpen}
						setSelectedReview={setSelectedReview}
					/>
				</>
			) : null}
			<div data-testid='city-page' className='mt-3 w-full px-2 md:px-0'>
				<AdsComponent slot='1526837416' />
				<div className='mx-auto mt-5 flex max-w-2xl flex-col gap-3 lg:max-w-7xl'>
					<CityInfo
						city={city}
						state={state}
						country={country}
						average={data.average}
						total={data.total}
						averages={data.catAverages}
					/>
				</div>
				<div className='mt-2 flex w-full justify-end px-4 lg:hidden'>
					<ButtonLight onClick={() => setMobileFiltersOpen(true)}>
						{t('filters')}
					</ButtonLight>
				</div>
				<div className='mx-auto max-w-2xl lg:max-w-7xl'>
					<TabGroup
						selectedIndex={selectedIndex}
						onChange={setSelectedIndex}
						as='div'
						className='w-full'
					>
						<TabList className='flex w-full justify-center gap-4 border-b p-3'>
							<Tab className='border-b-2 border-transparent px-1 pb-2 text-3xl font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-selected:border-indigo-500 data-selected:text-indigo-600'>
								{t('reviews')}
							</Tab>
							<Tab className='border-b-2 border-transparent px-1 pb-2 text-3xl font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none data-selected:border-indigo-500 data-selected:text-indigo-600'>
								<div className='flex flex-row gap-1'>
									<p>{t('analytics')}</p>
									<div className='flex h-full flex-col justify-start'>
										<span className='inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-teal-500/10 ring-inset'>
											{t('beta')}
										</span>
									</div>
								</div>
							</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								<div className='flex lg:flex-row lg:gap-2 lg:divide-x lg:divide-gray-200'>
									<CityMobileFilters
										mobileFiltersOpen={mobileFiltersOpen}
										setMobileFiltersOpen={setMobileFiltersOpen}
										zipFilter={zipFilter}
										zipOptions={zipOptions}
										updateParams={updateParams}
									/>
									<CityFilters
										selectedSort={selectedSort}
										setSelectedSort={setSelectedSort}
										sortOptions={sortOptions}
										zipFilter={zipFilter}
										zipOptions={zipOptions}
										updateParams={updateParams}
										loading={isLoadingHook}
									/>
									{!reviews.length && !isLoadingHook ? (
										<div className='mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center p-6'>
											<h1 className='mt-4 text-3xl text-gray-900 sm:text-5xl'>
												No results found
											</h1>
											<p className='mt-6 text-base leading-7 text-gray-600'>
												Sorry, we couldn&apos;t find any results for those
												filters.
											</p>
										</div>
									) : (
										<ReviewTable
											data={reviews}
											setReportOpen={setReportOpen}
											setSelectedReview={setSelectedReview}
											setRemoveReviewOpen={setRemoveReviewOpen}
											setEditReviewOpen={setEditReviewOpen}
											isLoading={isLoadingHook}
											userEditMode={userEditMode}
											setUserEditMode={setUserEditMode}
											setUserEditReviewOpen={setUserEditReviewOpen}
											setUserRemoveReviewOpen={setUserRemoveReviewOpen}
											selectedReviewID={selectedReview?.id}
										/>
									)}
								</div>
							</TabPanel>
							<TabPanel>
								<AnalyticsComponent queryParams={queryParams} />
							</TabPanel>
						</TabPanels>
					</TabGroup>
				</div>
			</div>
		</>
	)
}

export default CityPage
