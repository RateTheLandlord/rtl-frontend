import Spinner from '@/components/ui/Spinner'
import { fetcher } from '@/util/helpers/fetcher'
import { RecentReviews as IRecentReviews } from '@/util/interfaces/interfaces'
import dayjs from 'dayjs'
import useSWR from 'swr'

const RecentReviews = () => {
	const { data, error } = useSWR<Array<IRecentReviews>, unknown>(
		'/api/admin/get-recent',
		fetcher,
	)
	console.log(data)
	if (error) return <div>Error Loading...</div>
	if (!data) return <Spinner />
	return (
		<div className='flex flex-col gap-2'>
			{data.map((item, i) => (
				<div
					key={item.id}
					className='flex w-full justify-between gap-4 border-b'
				>
					<p>{i + 1}</p>
					<p>{item.landlord}</p>
					<p>{dayjs(item.created_at).format('DD/MM/YYYY HH:mm:ss')}</p>
				</div>
			))}
		</div>
	)
}

export default RecentReviews
