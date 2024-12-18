import RatingStars from '@/components/ui/RatingStars'
import Spinner from '@/components/ui/Spinner'
import { fetchWithBody } from '@/util/helpers/fetcher'
import Link from 'next/link'
import useSWR from 'swr'

interface IProps {
	state: string
	country: string
}

const CitiesTable = ({ state, country }: IProps) => {

	const { data: cities, error: cityError } = useSWR(
		['/api/review/state-city-info', { state, country }],
		fetchWithBody,
	)

	if (!cities) {
		return <Spinner />
	}

	if (cityError) console.log('Error retrieving information')
	return (
		<div className='flex-wrap w-full'>
			<div className='text-center text-xs md:text-xl'>Frequently Reviewed Cities in Your State/Province</div>	
			<div className='flex flex-row flex-wrap pl-0 md:pl-72 pr-0 md:pr-72 h-48 justify-center gap-2 overflow-auto'>
				{cities ? (
					cities.map((city) => {
						return (
							<Link
								key={city.city}
								href={`/cities/${encodeURIComponent(
									country,
								)}/${encodeURIComponent(state)}/${encodeURIComponent(
									city.city,
								)}`}
								className='flex rounded-md border bg-teal-600/5 p-2 hover:underline'
							>
								<div className='w-full grid grid-cols-3 text-sm md:text-lg'>
									<div className='flex-1 break-words'>
										<div>City Name: </div>
										<div className='pl-1 md:pl-2'>{city.city}</div>
									</div>
									<div className='text-center flex-wrap flex-1 justify-center break-words'>
										<p>
											Read
										</p>
										<p>
											{city.total} reviews
										</p>
									</div>
									<div className='pl-0 md:pl-20 flex-1 break-words'>
										<p className='pl-2'>
											Avg. Rating
										</p>
										<RatingStars value={Math.floor(city.average)} />
									</div>
								</div>
							</Link>
						)
					})
				) : (
					<Spinner />
				)}
			</div>
		</div>
	)
}

export default CitiesTable
