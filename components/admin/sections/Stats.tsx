import useSWR from 'swr'
import { fetcher } from '@/util/helpers/fetcher'
import Spinner from '@/components/ui/Spinner'
import TotalStats from '../components/TotalStats'
import { IStats } from '../types/types'

const Stats = () => {
	const { data, error } = useSWR<IStats, unknown>(
		`/api/admin/get-stats`,
		fetcher,
	)

	if (error) return <div>failed to load</div>
	if (!data) return <Spinner />

	return (
		<div className='flex flex-row flex-wrap gap-2'>
			<div className='w-full'>
				<h5 className='text-lg'>
					Total Reviews: {data.total_stats.total_reviews}
				</h5>
			</div>

			<TotalStats data={data.total_stats} />
		</div>
	)
}

export default Stats
