import RatingStars from '@/components/ui/RatingStars'
import Spinner from '@/components/ui/Spinner'
import { fetchWithBody } from '@/util/helpers/fetcher'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import useSWR from 'swr'

interface ICities {
	total: string
	average: number
	city: string
}

interface IProps {
	state: string
	country: string
}

const CitiesTable = ({ state, country }: IProps) => {
	const t = useTranslations('cities')
	const { data: cities, error: cityError } = useSWR<ICities[], unknown>(
		['/api/review/state-city-info', { state, country }],
		fetchWithBody,
	)

	if (!cities) {
		return <Spinner />
	}

	if (cityError) console.log('Error retrieving information')
	return (
		<div className='w-full flex-wrap'>
			<div className='text-center text-xs lg:text-xl'>{t('frequently')}</div>
			<div className='grid w-full gap-2 lg:grid-cols-2'>
				{cities.map((city) => {
					return (
						<Link
							key={city.city}
							href={`/cities/${encodeURIComponent(
								country,
							)}/${encodeURIComponent(state)}/${encodeURIComponent(city.city)}`}
							className='flex rounded-md border bg-teal-600/5 p-2 hover:underline'
						>
							<div className='grid w-full grid-cols-3 text-sm lg:text-lg'>
								<div className='flex-1 break-words'>
									<div>{t('name')}</div>
									<div className='pl-1 lg:pl-2'>{city.city}</div>
								</div>
								<div className='flex-1 flex-wrap justify-center text-center break-words'>
									<p>{t('read')}</p>
									<p>{t('reviews', { total: city.total })}</p>
								</div>
								<div className='flex-1 pl-0 break-words lg:pl-20'>
									<p className='pl-2'>{t('rating')}</p>
									<RatingStars
										testid='CitiesTableRatingStars'
										value={Math.floor(city.average)}
									/>
								</div>
							</div>
						</Link>
					)
				})}
			</div>
		</div>
	)
}

export default CitiesTable
