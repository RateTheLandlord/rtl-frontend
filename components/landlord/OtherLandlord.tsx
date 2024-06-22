import { OtherLandlord } from '@/util/interfaces/interfaces'
import Spinner from '../ui/Spinner'
import Link from 'next/link'
import RatingStars from '@/components/ui/RatingStars'

interface IProps {
	landlords: Array<OtherLandlord>
}

const OtherLandlordInfo = ({ landlords }: IProps) => {
	if (!landlords.length) return <Spinner />

	return (
		<>
			<h3 className='mt-4 text-lg text-gray-900'>
				View Other Landlords in {landlords[0]?.topcity}:
			</h3>
			<div className='flex flex-row flex-wrap items-center gap-3 xl:col-span-1 '>
				{landlords.map((otherLandlord, index) => {
					return (
						<div
							key={index}
							className='flex flex-row flex-wrap items-center justify-between bg-teal-600/5 p-2 lg:min-w-[220px] lg:max-w-[225px] lg:flex-col'
						>
							<div className='flex flex-col items-center'>
								<Link
									href={`/landlord/${encodeURIComponent(otherLandlord.name)}`}
									className='col mb-4 flex w-full cursor-pointer flex-col break-words text-lg  hover:underline lg:mb-2 lg:items-center'
									data-umami-event='Reviews / Landlord Link'
								>
									<h6 className='text-center'>{otherLandlord.name}</h6>
									<p className='text-center text-sm'>
										Read {otherLandlord.reviewcount} review(s)
									</p>
								</Link>
								<RatingStars value={Math.floor(otherLandlord.avgrating)} />
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}

export default OtherLandlordInfo
