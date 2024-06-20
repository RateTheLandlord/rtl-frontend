import { useEffect, useState } from 'react'
import {OtherLandlord } from '@/util/interfaces/interfaces'
import { classNames } from '@/util/helpers/helper-functions'
import Spinner from '../ui/Spinner'
import { ILandlordReviews} from '@/lib/review/review'
import Link from 'next/link'
import { StarIcon } from '@heroicons/react/solid'


interface IProps {
	data: ILandlordReviews
}

const OtherLandlordInfo = ({ data }: IProps) => {
	const [otherLandlords, setOtherLandlords] = useState<Array<OtherLandlord>>([])

	if (!data.otherLandlords.length) return <Spinner />

    

	useEffect(() => {
		setOtherLandlords(data.otherLandlords)
	}, [data.otherLandlords])


	return (
		<>
            <h3 className='mt-4 text-lg text-gray-900'>View Other Landlords in {otherLandlords.pop()?.topcity}:</h3>
            <div className='flex flex-row flex-wrap items-center gap-3 xl:col-span-1 '>
                {otherLandlords.map((otherLandlord, index) => {
                    return (
                        <div key = {index} className='flex flex-row flex-wrap items-center justify-between bg-teal-600/5 p-2 lg:min-w-[220px] lg:max-w-[225px] lg:flex-col'>
                            <div className='flex flex-col'>
                            <Link
                                href={`/landlord/${encodeURIComponent(
                                    otherLandlord.name,
                                )}`}
                                className='col mb-4 flex w-full cursor-pointer flex-col break-words text-lg  hover:underline lg:mb-2 lg:items-center'
                                data-umami-event='Reviews / Landlord Link'
                            >
                                <h6 className='text-center'>{otherLandlord.name}</h6>
                                <p className='text-center text-sm'>
                                    Read all reviews
                                </p>
                            </Link>
                                <div className='flex items-center'>
                                    {[0, 1, 2, 3, 4].map((star) => (
                                        <StarIcon
                                            key={star}
                                            className={classNames(
                                                Math.floor(otherLandlord.avgrating) > star
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-200',
                                                'h-5 w-5 flex-shrink-0',
                                            )}
                                            aria-hidden='true'
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
		</>
	)
}

export default OtherLandlordInfo