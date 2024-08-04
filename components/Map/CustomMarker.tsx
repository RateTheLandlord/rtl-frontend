import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../ui/Spinner'
import { IZipStats } from '@/lib/review/review'
import RatingStars from '../ui/RatingStars'
import useSWR from 'swr'
import { fetcher, fetchWithBody } from '@/util/helpers/fetcher'

interface IProps {
	location: {
		longitude: number
		latitude: number
		id: number
		name: string
		value: string
	}
	country: string
	state: string
}

const CustomMarker = ({ location, country, state }: IProps) => {
	const [expand, setExpand] = useState(false)

	const { data: stats, error } = useSWR(
		expand
			? [
					'/api/review/get-zip-stats',
					{ zip: location.value, country_code: country, state: state },
			  ]
			: null,
		fetchWithBody,
	)

	if (error) {
		toast.error('Error getting Zip / Postal Code Stats')
	}

	if (!expand) {
		return (
			<span
				onClick={() => setExpand((p) => !p)}
				aria-hidden='true'
				className='relative z-50 flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center'
			>
				<span className='absolute h-4 w-4 rounded-full bg-teal-200' />
				<span className='relative block h-2 w-2 rounded-full bg-teal-600' />
			</span>
		)
	} else {
		return (
			<div
				onClick={() => setExpand((p) => !p)}
				className='z-[999] w-full cursor-pointer items-center rounded-md bg-teal-600 px-4 py-2 text-white'
			>
				<div className='flex w-full flex-row items-center justify-center'>
					<p>{location.value}</p>
				</div>
				{!stats && expand ? <Spinner /> : null}
				{stats && (
					<div className='divide flex w-full flex-col gap-2 divide-white'>
						<div className='flex flex-row justify-between text-white'>
							<p>Total Reviews</p>
							<p>{stats.total}</p>
						</div>
						<div className='flex flex-row justify-between text-white'>
							<p>Average</p>
							<RatingStars value={stats.average} />
						</div>
					</div>
				)}
			</div>
		)
	}
}

export default CustomMarker
