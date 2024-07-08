import useSWR from 'swr'
import { useState } from 'react'
import { fetchWithBody } from '@/util/helpers/fetcher'
import Spinner from '@/components/ui/Spinner'
import BarGraph from '../components/BarGraph'
import dayjs from 'dayjs'
import GraphCard from '../components/GraphCard'
import AreaGraph from '../components/AreaGraph'
import PieGraph from '../components/PieGraph'
import StatsDropdown from '../components/StatsDropdown'
import { useStatsDates } from '@/util/hooks/useStatsDates'
import TotalStats from '../components/TotalStats'
import { IStats } from '../types/types'

const queryOptions = [
	{
		name: 'Last 7 Days',
		value: 'last7',
	},
	{
		name: 'Last 14 Days',
		value: 'last14',
	},
	{
		name: 'Last 30 Days',
		value: 'last30',
	},
	{
		name: 'This Month',
		value: 'currMonth',
	},
	{
		name: 'Last 3 Months',
		value: 'last3m',
	},
	{
		name: 'Last 6 Months',
		value: 'last6m',
	},
	{
		name: 'Last 1 Year',
		value: 'last1y',
	},
	{
		name: 'All Time',
		value: 'allTime',
	},
]

const Stats = () => {
	const [query, setQuery] = useState(queryOptions[0])
	const [startDate, groupBy] = useStatsDates(query.value)

	const { data, error } = useSWR<IStats>(
		[`/api/admin/get-stats`, { startDate, groupBy }],
		fetchWithBody,
	)

	if (error) return <div>failed to load</div>
	if (!data) return <Spinner />

	const getDetailedStats = (key) => {
		if (key === 'total') {
			const stat = data.detailed_stats.map((stat) => {
				if (groupBy === 'month') {
					return {
						date: dayjs(stat.date).format('YYYY-MM'),
						total: stat.total,
					}
				} else {
					return {
						date: dayjs(stat.date).format('YYYY-MM-DD'),
						total: stat.total,
					}
				}
			})
			return stat
		}
		const stat = data.detailed_stats.map((stat) => {
			if (groupBy === 'month') {
				return { date: dayjs(stat.date).format('YYYY-MM'), ...stat[key] }
			} else {
				return { date: dayjs(stat.date).format('YYYY-MM-DD'), ...stat[key] }
			}
		})
		return stat
	}

	const getCountryTotals = () => {
		const countryData = [
			{ name: 'US', value: Number(data.total_stats.countryStats.US?.total) },
			{ name: 'CA', value: Number(data.total_stats.countryStats.CA?.total) },
			{ name: 'NZ', value: Number(data.total_stats.countryStats.NZ?.total) },
			{ name: 'AU', value: Number(data.total_stats.countryStats.AU?.total) },
			{ name: 'UK', value: Number(data.total_stats.countryStats.GB?.total) },
			// { name: 'DE', value: Number(data.total_stats.countryStats.DE?.total) },
			{ name: 'IE', value: Number(data.total_stats.countryStats.IE?.total) },
		]
		return countryData
	}

	return (
		<div className='flex flex-row flex-wrap gap-2'>
			<div className='w-full'>
				<h5 className='text-lg '>
					Total Reviews: {data.total_stats.total_reviews}
				</h5>
			</div>
			{data.detailed_stats.length && (
				<>
					<div className='flex w-full justify-end'>
						<StatsDropdown
							options={queryOptions}
							setSelected={setQuery}
							selected={query}
						/>
					</div>
					<GraphCard title='All Reviews'>
						<AreaGraph data={getDetailedStats('total')} />
					</GraphCard>
					<GraphCard title='Total By Country (All Time)'>
						<PieGraph data={getCountryTotals()} />
					</GraphCard>
					<GraphCard title='Countries'>
						<BarGraph data={getDetailedStats('country_codes')} />
					</GraphCard>
					<GraphCard title='State'>
						<BarGraph data={getDetailedStats('state')} />
					</GraphCard>
					<GraphCard title='Cities'>
						<BarGraph data={getDetailedStats('cities')} />
					</GraphCard>
					<GraphCard title='Zip'>
						<BarGraph data={getDetailedStats('zip')} />
					</GraphCard>
				</>
			)}
			<TotalStats data={data.total_stats} />
		</div>
	)
}

export default Stats
