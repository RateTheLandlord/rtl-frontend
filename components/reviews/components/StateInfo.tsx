import CatAverages from '@/components/city/CatAverages'
import Button from '@/components/ui/button'
import RatingStars from '@/components/ui/RatingStars'
import Spinner from '@/components/ui/Spinner'
import { useAppDispatch } from '@/redux/hooks'
import { clearFilters } from '@/redux/query/querySlice'
import { fetchWithBody } from '@/util/helpers/fetcher'
import { toTitleCase } from '@/util/helpers/toTitleCase'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useTranslation } from 'next-i18next'

interface IProps {
	state: string
	country: string
	setLocationOpen: (bool: boolean) => void
}

const StateInfo = ({ state, country, setLocationOpen }: IProps) => {
	const { t } = useTranslation('landlord')
	const router = useRouter()
	const { data, error } = useSWR(
		['/api/review/state-info', { state, country }],
		fetchWithBody,
	)

	const { data: cities, error: cityError } = useSWR(
		['/api/review/state-city-info', { state, country }],
		fetchWithBody,
	)

	const dispatch = useAppDispatch()

	if (!data) {
		return <Spinner />
	}

	if (error || cityError) console.log('Error retrieving information')
	return (
		<div className='w-full'>
			<div className='rounded-xl bg-gray-50 p-4'>
				<div className='py-8 text-center sm:py-12'>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
						{`${toTitleCase(decodeURIComponent(state))}, ${decodeURIComponent(
							country.toLocaleUpperCase(),
						)}`}
					</h2>
					<p className='mt-2 text-gray-700'>
						{t('landlord.rental-experience', {
							total: data.total,
							location: `${toTitleCase(
								decodeURIComponent(state),
							)}, ${decodeURIComponent(country.toLocaleUpperCase())}`,
						})}
					</p>
				</div>

				<div className='flex w-full justify-center'>
					<Button
						onClick={() => {
							dispatch(clearFilters())
							setLocationOpen(true)
							router.push(`/reviews`, undefined, { shallow: true })
						}}
					>
						{t('landlord.change-location')}
					</Button>
				</div>

				<CatAverages
					averages={data.catAverages}
					average={data.average}
					total={data.total}
				/>
				<div className='flex w-full flex-row flex-wrap justify-center gap-2'>
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
									className='flex items-center justify-center rounded-md border bg-teal-600/5 p-2 hover:underline'
								>
									<div className='flex flex-col items-center justify-center'>
										<div
											className='col mb-4 flex w-full cursor-pointer flex-col break-words text-lg lg:mb-2 lg:items-center'
											data-umami-event='Reviews / Landlord Link'
										>
											<h6 className='text-center'>{city.city}</h6>
											<p className='text-center text-sm'>
												{t('landlord.read-total', { total: city.total })}
											</p>
										</div>
										<RatingStars testid='staterating' value={Math.floor(city.average)} />
									</div>
								</Link>
							)
						})
					) : (
						<Spinner />
					)}
				</div>
			</div>
		</div>
	)
}

export default StateInfo
