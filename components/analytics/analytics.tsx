import RatingStars from '../ui/RatingStars'
import { useTranslation } from 'next-i18next'
import Spinner from '@/components/ui/Spinner'
import useSWR from 'swr'
import { fetchWithBody } from '@/util/helpers/fetcher'
import {
	AnalyticsChartResponse,
	AnalyticsResponse,
} from '@/lib/analytics/models/review'
import { ISortOptions } from '../reviews/review'
import React from 'react'
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts'

export interface QueryParams {
	sort: ISortOptions
	state: string
	country: string
	city: string
	zip: string
	search: string
	limit: string
}

interface AnalyticProps {
	queryParams: QueryParams
}

const AnalyticsComponent = ({ queryParams }: AnalyticProps) => {
	const { t } = useTranslation('reviews')

	const { data, error } = useSWR<AnalyticsResponse, Error>(
		['/api/review/review-analytics', { queryParams }],
		fetchWithBody,
	)

	const { chartData, chartDataError } = useSWR<AnalyticsChartResponse, Error>(
		['/api/review/review-analytics-chart', { queryParams }],
		fetchWithBody,
	)

	// const fetchDynamicFilterOptions = async () => {
	// 	try {
	// 		const filterOptions = await fetchFilterOptions(
	// 			formData.country?.value,
	// 			formData.state?.value,
	// 			'',
	// 			'',
	// 		)
	// 		setFormData((prevData) => ({
	// 			...prevData,
	// 			dynamicStateOptions: filterOptions.states,
	// 		}))
	// 	} catch (error) {
	// 		console.error('Error fetching filter options:', error)
	// 	}
	// }

	if (!data) {
		return <Spinner />
	}

	return (
		<div className='grid w-full grid-cols-2 bg-gray-50'>
			<div className='flex-1'>
				<ResponsiveContainer width={'100%'} height={'100%'}>
					<LineChart
						width={500}
						height={300}
						data={chartData}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line
							type='monotone'
							dataKey='pv'
							stroke='#8884d8'
							activeDot={{ r: 8 }}
						/>
						<Line type='monotone' dataKey='uv' stroke='#82ca9d' />
					</LineChart>
				</ResponsiveContainer>
			</div>
			<div className='flex-1'>
				<div className='h-4'></div>
				<div className='h-52 rounded-lg border-4 border-teal-600 bg-white p-4'>
					<div className='bold flex items-center justify-center pb-12 pt-2 text-xl underline'>
						Total Reviews
					</div>
					<div className='grid w-full grid-cols-3 gap-2'>
						<div className='flex h-16 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 90 Days:</div>
							<div>
								{data.totalReviewsT90
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							</div>
						</div>
						<div className='flex flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 180 Days:</div>
							{data.totalReviewsT180
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						</div>
						<div className='flex flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 360 Days:</div>
							{data.totalReviewsT360
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						</div>
					</div>
				</div>
				<div className='h-4'></div>
				<div className='h-52 rounded-lg border-4 border-teal-600 bg-white p-4'>
					<div className='bold flex items-center justify-center pb-12 pt-2 text-xl underline'>
						Average Rating
					</div>
					<div className='grid w-full grid-cols-3 gap-2'>
						<div className='flex h-16 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 90 Days:</div>
							<div>
								<RatingStars value={Math.floor(data.avgRatingT90)} />
							</div>
						</div>
						<div className='flex flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 180 Days:</div>
							<RatingStars value={Math.floor(data.avgRatingT180)} />
						</div>
						<div className='flex flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 360 Days:</div>
							<RatingStars value={Math.floor(data.avgRatingT360)} />
						</div>
					</div>
				</div>
				<div className='h-4'></div>
				<div className='h-52 rounded-lg border-4 border-teal-600 bg-white p-4'>
					<div className='bold flex items-center justify-center pb-12 pt-2 text-xl underline'>
						Median Reported Rent
					</div>
					<div className='grid w-full grid-cols-3 gap-2'>
						<div className='flex h-16 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 90 Days:</div>
							<div>
								$
								{data.medianRentT90
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							</div>
						</div>
						<div className='flex flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 180 Days:</div>$
							{data.medianRentT180
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						</div>
						<div className='flex flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 360 Days:</div>$
							{data.medianRentT360
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AnalyticsComponent
