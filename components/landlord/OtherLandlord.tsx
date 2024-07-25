import { OtherLandlord } from '@/util/interfaces/interfaces'
import Spinner from '../ui/Spinner'
import Link from 'next/link'
import RatingStars from '@/components/ui/RatingStars'
import useSWR from 'swr'
import { fetcher } from '@/util/helpers/fetcher'

interface IProps {
	landlord: string
}

const OtherLandlordInfo = ({ landlord }: IProps) => {
	const { data: landlords, error } = useSWR<Array<OtherLandlord>>(
		`/api/review/get-other-landlords?landlord=${encodeURIComponent(landlord)}`,
		fetcher,
	)

	if (!landlords) return <Spinner />

	if (error || !landlords.length) return null

	return (
		<>
			<h3 className='mt-4 text-lg text-gray-900'>
				View Other Landlords in {landlords[0]?.topcity}:
			</h3>
			<div className='grid-rows-5 grid grid-cols-2 gap-2 lg:grid-cols-5 lg:grid-rows-2'>
				{landlords.map((otherLandlord, index) => {
					return (
						<Link
							key={index}
							href={`/landlord/${encodeURIComponent(otherLandlord.name)}`}
							className='flex items-center justify-center rounded-md border bg-teal-600/5 p-2 hover:underline'
						>
							<div className='flex flex-col items-center justify-center'>
								<div
									className='col mb-4 flex w-full cursor-pointer flex-col break-words text-lg lg:mb-2 lg:items-center'
									data-umami-event='Reviews / Landlord Link'
								>
									<h6 className='text-center'>{otherLandlord.name}</h6>
									<p className='text-center text-sm'>
										Read {otherLandlord.reviewcount} review(s)
									</p>
								</div>
								<RatingStars value={Math.floor(otherLandlord.avgrating)} />
							</div>
						</Link>
					)
				})}
			</div>
		</>
	)
}

export default OtherLandlordInfo
