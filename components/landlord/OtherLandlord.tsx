import { OtherLandlord } from '@/util/interfaces/interfaces'
import Spinner from '../ui/Spinner'
import Link from 'next/link'
import RatingStars from '@/components/ui/RatingStars'
import useSWR from 'swr'
import { fetcher } from '@/util/helpers/fetcher'
import { useTranslations } from 'next-intl'

interface IProps {
	landlord: string
}

const OtherLandlordInfo = ({ landlord }: IProps) => {
	const t = useTranslations('landlord')
	const { data: landlords, error } = useSWR<OtherLandlord[], unknown>(
		`/api/review/get-other-landlords?landlord=${encodeURIComponent(landlord)}`,
		fetcher,
	)

	if (!landlords) return <Spinner />

	if (error || !landlords.length) return null

	return (
		<>
			<h3 className='mt-4 text-lg text-gray-900'>
				{t('view-other-landlords')} {landlords[0]?.topCity}:
			</h3>
			<div className='grid grid-cols-2 grid-rows-5 gap-2 lg:grid-cols-5 lg:grid-rows-2'>
				{landlords.map((otherLandlord, index) => {
					return (
						<Link
							key={index}
							href={`/landlord/${encodeURIComponent(otherLandlord.name)}`}
							className='bg-primary/5 flex items-center justify-center rounded-md border p-2 hover:underline'
						>
							<div className='flex flex-col items-center justify-center'>
								<div
									className='col mb-4 flex w-full cursor-pointer flex-col text-lg wrap-break-word lg:mb-2 lg:items-center'
									data-umami-event='Reviews / Landlord Link'
								>
									<p className='text-center text-lg'>{otherLandlord.name}</p>
									<p className='text-center text-sm'>
										{t('read-other-landlords', {
											reviewcount: otherLandlord.reviewcount,
										})}
									</p>
								</div>
								<RatingStars
									testid='otherlandlordsrating'
									value={Math.floor(otherLandlord.avgrating)}
								/>
							</div>
						</Link>
					)
				})}
			</div>
		</>
	)
}

export default OtherLandlordInfo
