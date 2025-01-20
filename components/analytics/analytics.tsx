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
import Sidebar from './ui/sidebar'

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
	>(chartData?.avgRatingChartData || [])

	const [dataKey, setDataKey] = useState<string>('trailing_combined_avg')
	const [maxY, setMaxY] = useState<number>(5)
	const [yAxisLabel, setYAxisLabel] = useState<string>('Avg. Rating')
	const [chartLabel, setChartLabel] = useState<string>(
		'T365 Day Avg. Rating as of Each Day',
	)

	const CustomTooltip = ({
		active,
		payload,
		label,
	}: TooltipProps<ValueType, NameType>) => {
		if (active && payload && payload.length) {
			if (dataKey === 'trailing_combined_avg') {
				return (
					<div className='custom-tooltip border-4 border-teal-600 rounded-lg bg-gray-100'>
						<p className='label pt-2 pl-2 pr-2'>Avg. Landlord Rating as of </p>
						<p className='label pl-2 pr-2 text-center'>{label}: </p>
						<div className='flex justify-center'>
							<p className='label pb-2'>
								<RatingStars
									testid='AnalyticsTooltipRatingsStars'
									value={Math.floor(Number(payload[0].value))}
								/>
							</p>
						</div>
					</div>
				)
			} else{
				return (
					<div className='custom-tooltip border-4 border-teal-600 rounded-lg bg-gray-100'>
						<p className='label pt-2 pl-2 pr-2'>
							Median Recorded Rent as of
						</p>
						<p className='label pl-2 text-center'>
							{label}:{' '}
						</p>
						<p className='label justify-center text-center text-xl'>
							${Math.round(Number(payload[0].value) ?? 0).toLocaleString()}
						</p>
					</div>
				)
			}
		}

		return null
	}

	const handleClick = async (metric: string) => {
		if (chartData) {
			if (metric === 'median') {
				setActiveChartData(chartData.medianChartData || [])
				setDataKey('trailing_median_rent')
				setYAxisLabel('Median Rent')
				setChartLabel('T365 Day Median Rent as of Each Day')
				if (chartData?.medianChartData) {
					setMaxY(
						Math.max(
							...chartData.medianChartData.map((chartData) => chartData.metric),
						) + 500,
					)
				}
			}else {
				setActiveChartData(chartData.avgRatingChartData || [])
				setDataKey('trailing_combined_avg')
				setYAxisLabel('Avg. Rating')
				setChartLabel('T365 Day Avg. Rating as of Each Day')
				setMaxY(5)
			}
		}
	}

	useEffect(() => {
		setActiveChartData(chartData?.avgRatingChartData || [])
		if (chartData?.avgRatingChartData) {
			setMaxY(5)
		}
	}, [chartData])

	if (!data) {
		return <Spinner />
	}

	return (
		<div className='grid w-full grid-cols-1 gap-2 bg-gray-50 lg:grid-cols-[3fr_1fr]'>
			<div className='flex-1 lg:hidden'>
				<Sidebar data={data} handleClick={handleClick} />
			</div>
			<div className='flex-1 lg:w-[100%]'>
				<div className='hidden h-4 lg:block'></div>
				<div className='h-128 rounded-lg border-4 border-teal-600 bg-white lg:p-4'>
					<ResponsiveContainer width={'100%'} height={'100%'}>
						<LineChart
							width={600}
							height={300}
							data={activeChartData}
							margin={{
								top: 5,
								right: 20,
								left: 10,
								bottom: 5,
							}}
						>
							<XAxis dataKey='review_date' height={50}>
								<Label
									value='Last 365 Days'
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
			<div className='hidden lg:block lg:flex-1'>
				<div className='h-5'></div>
				<div
					className='h-[47%] rounded-lg border-4 border-teal-600 bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
					onClick={() => handleClick('rating')}
				>
					<div className='flex justify-center pb-4 pt-2 text-center'>
						<div>
							<p className='bold  text-xl underline'>Average Rating</p>
							<div className='text-center text-xs'>(Select to Filter)</div>
						</div>
					</div>
					<div className='grid w-full grid-rows-3 gap-2'>
						<div className='flex h-16 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 90 Days:</div>
							<div>
								<RatingStars
									testid='Analytics90DayRatingStar'
									value={Math.floor(data.avgRatingT90)}
								/>
							</div>
						</div>
						<div className='flex flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 180 Days:</div>
							<RatingStars
								testid='Analytics180DayRatingStar'
								value={Math.floor(data.avgRatingT180)}
							/>
						</div>
						<div className='flex flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-lg'>
							<div>Last 365 Days:</div>
							<RatingStars
								testid='Analytics365DayRatingStar'
								value={Math.floor(data.avgRatingT365)}
							/>
						</div>
					</div>
				</div>
				<div className='h-2'></div>
				<div
					className='h-[47%] rounded-lg border-4 border-teal-600 bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
					onClick={() => handleClick('median')}
				>
					<div className='flex justify-center pb-4 pt-2 text-center'>
						<div>
							<p className='bold  text-xl underline'>Median Reported Rent</p>
							<div className='text-center text-xs'>(Select to Filter)</div>
						</div>
					</div>
					<div className='grid w-full grid-rows-3 gap-2'>
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
							<div>Last 365 Days:</div>$
							{data.medianRentT365
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
