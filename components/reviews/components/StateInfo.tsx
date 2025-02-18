import CatAverages from '@/components/city/CatAverages'
import CitiesTable from '@/components/city/CitiesTable'
import Button from '@/components/ui/button'
import Spinner from '@/components/ui/Spinner'
import { useAppDispatch } from '@/redux/hooks'
import { clearFilters } from '@/redux/query/querySlice'
import { fetchWithBody } from '@/util/helpers/fetcher'
import { toTitleCase } from '@/util/helpers/toTitleCase'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useTranslations } from 'next-intl'
import { IStateStats } from '@/lib/review/state-stats'

interface IProps {
	state: string
	country: string
	setLocationOpen: (bool: boolean) => void
}

const StateInfo = ({ state, country, setLocationOpen }: IProps) => {
	const t = useTranslations('landlord')
	const router = useRouter()
	const { data, error } = useSWR<IStateStats, unknown>(
		['/api/review/state-info', { state, country }],
		fetchWithBody,
	)

	const dispatch = useAppDispatch()

	if (!data) {
		return <Spinner />
	}

	if (error) console.log('Error retrieving information')
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
						{t('rental-experience', {
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
							router
								.push(`/reviews`, undefined, { shallow: true })
								.catch(() => console.log('Error Setting URL'))
							dispatch(clearFilters())
							setLocationOpen(true)
						}}
					>
						{t('change-location')}
					</Button>
				</div>

				<CatAverages
					averages={data.catAverages}
					average={data.average}
					total={data.total}
				/>
				<CitiesTable state={state} country={country} />
			</div>
		</div>
	)
}

export default StateInfo
