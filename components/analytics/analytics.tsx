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
import React, { useState, useEffect } from 'react'
import { AnalyticsResponseInterface } from '@/util/interfaces/interfaces'
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	TooltipProps,
	ResponsiveContainer,
	Label,
} from 'recharts'
import {
	NameType,
	ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

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

	const { data: chartData, error: chartDataError } = useSWR<
		AnalyticsChartResponse,
		Error
	>(['/api/review/review-analytics-chart', { queryParams }], fetchWithBody)

	const [activeChartData, setActiveChartData] = useState<
		AnalyticsResponseInterface[]
	>(chartData?.reviewsChartData || [])

	const [dataKey, setDataKey] = useState<string>('trailing_review_count')
	const [maxY, setMaxY] = useState<number>(500)
	const [yAxisLabel, setYAxisLabel] = useState<string>('Review Count')
	const [chartLabel, setChartLabel] = useState<string>(
		'Trailing 360 Day Review Count as of Each Day',
	)

	const CustomTooltip = ({
		active,
		payload,
		label,
	}: TooltipProps<ValueType, NameType>) => {
		if (active && payload && payload.length) {
			if (dataKey === 'trailing_combined_avg') {
				return (
					<div className='custom-tooltip'>
						<p className='label'>Avg. Landlord Rating as of {label}: </p>
						<div className='flex justify-center'>
							<p className='label'>
								<RatingStars testid='AnalyticsTooltipRatingsStars' value={Math.floor(Number(payload[0].value))} />
							</p>
						</div>
					</div>
				)
			} else if (dataKey === 'trailing_median_rent') {
				return (
					<div className='custom-tooltip'>
						<p className='label'>
							Trailing 360 Day Median Reported Monthly Rent as of {label}:{' '}
						</p>
						<p className='label justify-center text-center text-xl'>
							{payload[0].value?.toLocaleString()}
						</p>
					</div>
				)
			} else {
				return (
					<div className='custom-tooltip'>
						<p className='label'>
							Reviews Created in Trailing 360 Days as of {label}:{' '}
						</p>
						<p className='label justify-center text-center text-xl'>
							{payload[0].value?.toLocaleString()}
						</p>
					</div>
				)
			}
		}
	}

	const handleClick = async (metric: string) => {
		if (chartData) {
			if (metric === 'median') {
				setActiveChartData(chartData.medianChartData || [])
				setDataKey('trailing_median_rent')
				setYAxisLabel('Median Rent')
				setChartLabel('Trailing 360 Day Median Rent as of Each Day')
				if (chartData?.medianChartData) {
					setMaxY(
						Math.max(
							...chartData.medianChartData.map((chartData) => chartData.metric),
						) + 500,
					)
				}
			} else if (metric === 'rating') {
				setActiveChartData(chartData.avgRatingChartData || [])
				setDataKey('trailing_combined_avg')
				setYAxisLabel('Avg. Rating')
				setChartLabel('Trailing 360 Day Avg. Rating as of Each Day')
				setMaxY(5)
			} else {
				setActiveChartData(chartData.reviewsChartData || [])
				setDataKey('trailing_review_count')
				setYAxisLabel('Review Count')
				setChartLabel('Trailing 360 Day Review Count as of Each Day')
				if (chartData?.reviewsChartData) {
					setMaxY(
						Math.max(
							...chartData.reviewsChartData.map(
								(chartData) => chartData.metric,
							),
						) + 100,
					)
				}
			}
		}
	}

	useEffect(() => {
		setActiveChartData(chartData?.reviewsChartData || [])
		if (chartData?.reviewsChartData) {
			setMaxY(
				Math.max(
					...chartData.reviewsChartData.map((chartData) => chartData.metric),
				) + 100,
			)
		}
	}, [chartData])

	if (!data) {
		return <Spinner />
	}

	return (
		<div className='grid w-full grid-cols-2 gap-2 bg-gray-50'>
			<div className='flex-1'>
				<div className='h-4'></div>
				<div className='h-128 rounded-lg border-4 border-teal-600 bg-white p-4'>
					<ResponsiveContainer width={'100%'} height={'100%'}>
						<LineChart
							width={500}
							height={300}
							data={activeChartData}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<XAxis dataKey='review_date' height={50}>
								<Label
									value='Last 360 Days'
									position={'insideBottom'}
									offset={0}
								/>
								<Label
									value={chartLabel}
									position={'insideBottom'}
									offset={560}
								/>
							</XAxis>
							<YAxis type='number' domain={[0, maxY]} dataKey='metric'>
								<Label
									value={yAxisLabel}
									position={'insideLeft'}
									offset={0}
									angle={-90}
								/>
							</YAxis>
							<Tooltip content={<CustomTooltip />} />
							<Line
								type='monotone'
								dataKey='metric'
								stroke='#8884d8'
								activeDot={{ r: 8 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
			<div className='flex-1'>
				<div className='h-4'></div>
				<div
					className='h-52 rounded-lg border-4 border-teal-600 bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
					onClick={() => handleClick('review')}
				>
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
				<div
					className='h-52 rounded-lg border-4 border-teal-600 bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
					onClick={() => handleClick('rating')}
				>
					<div className='bold flex items-center justify-center pb-12 pt-2 text-xl underline'>
						Average Rating
					</div>
					<div className='grid w-full grid-cols-3 gap-2'>
						<div className='flex h-16 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 90 Days:</div>
							<div>
								<RatingStars testid='Analytics90DayRatingStar' value={Math.floor(data.avgRatingT90)} />
							</div>
						</div>
						<div className='flex flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 180 Days:</div>
							<RatingStars testid='Analytics180DayRatingStar' value={Math.floor(data.avgRatingT180)} />
						</div>
						<div className='flex flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 360 Days:</div>
							<RatingStars testid='Analytics360DayRatingStar' value={Math.floor(data.avgRatingT360)} />
						</div>
					</div>
				</div>
				<div className='h-4'></div>
				<div
					className='h-52 rounded-lg border-4 border-teal-600 bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
					onClick={() => handleClick('median')}
				>
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
