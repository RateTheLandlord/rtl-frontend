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
		return (
			<div className='flex w-full items-center justify-center py-4'>
				<Spinner />
			</div>
		)
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
							className='flex rounded-md border bg-[#7e9860]/5 p-2 hover:underline'
						>
							<div className='flex w-full justify-between text-sm lg:text-lg'>
								<div className='flex flex-col text-center break-words'>
									<div>{t('name')}</div>
									<div>{city.city}</div>
								</div>
								<div className='flex flex-col text-center break-words'>
									<p>{t('read')}</p>
									<p>{t('reviews', { total: city.total })}</p>
								</div>
								<div className='flex flex-col items-center break-words'>
									<p className='text-center'>{t('rating')}</p>
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
