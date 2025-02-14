import useSWR from 'swr'
import RatingStars from '../ui/RatingStars'
import { fetchWithBody } from '@/util/helpers/fetcher'
import Spinner from '../ui/Spinner'
import { Options } from '@/util/interfaces/interfaces'
import Link from 'next/link'
import { IZipLocations } from '@/lib/location/location'

interface IProps {
	country: Options | null
	state: Options | null
	selectedPoint: IZipLocations
}

const Information = ({ selectedPoint, country, state }: IProps) => {
	const { data: stats, error } = useSWR(
		[
			'/api/review/get-zip-stats',
			{
				zip: selectedPoint.zip,
				country_code: country?.value,
				state: state?.value,
			},
		],
		fetchWithBody,
	)

	if (!stats) {
		return (
			<div className='flex w-full justify-center px-4 py-6'>
				<Spinner />
			</div>
		)
	}
	if (error) {
		return (
			<p className='mt-6 text-base leading-7 text-gray-600'>
				Sorry, we seem to have run into a small error. Please try again.
			</p>
		)
	}
	return (
		<div className='mt-6 border-t border-gray-100'>
			<div className='divide-y divide-gray-100'>
				<div className='flex w-full items-center justify-between px-4 py-6'>
					<p className='text-sm leading-6 font-medium text-gray-900'>
						Postal Code
					</p>
					<p className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
						{selectedPoint.zip}
					</p>
				</div>
				<div className='flex w-full items-center justify-between px-4 py-6'>
					<p className='text-sm leading-6 font-medium text-gray-900'>
						Total Reviews
					</p>
					<p className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
						{stats.total}
					</p>
				</div>
				<div className='flex w-full items-center justify-between px-4 py-6'>
					<p className='text-sm leading-6 font-medium text-gray-900'>Average</p>
					<p className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
						<RatingStars testid='mapratings' value={stats.average} />
					</p>
				</div>
				<div className='flex w-full justify-center py-6'>
					<Link
						href={`/zips/${encodeURIComponent(
							country?.value || '',
						)}/${encodeURIComponent(state?.value || '')}/${encodeURIComponent(
							selectedPoint.zip,
						)}`}
						className='cursor-pointer text-sm leading-6 font-medium text-gray-900 underline'
					>
						View Reviews
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Information
