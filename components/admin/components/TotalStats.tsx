import { useState } from 'react'
import StateStats from '../components/StateStats'
import { ICountryStats } from '../types/types'

const TotalStats = ({ data }: { data: ICountryStats }) => {
	const [country, setCountry] = useState<string | null>(null)

	const handleCountryClick = (country: string) => {
		setCountry(country)
	}

	const renderStats = () => {
		const stats: Array<{
			country: string
			label: string
			data?: string
			isActive: boolean
		}> = [
			{
				country: 'CA',
				label: 'Canadian Reviews',
				data: data.countryStats.CA?.total,
				isActive: country === 'CA',
			},
			{
				country: 'US',
				label: 'US Reviews',
				data: data.countryStats.US?.total,
				isActive: country === 'US',
			},
			{
				country: 'UK',
				label: 'UK Reviews',
				data: data.countryStats.GB?.total,
				isActive: country === 'UK',
			},
			{
				country: 'AU',
				label: 'Australia Reviews',
				data: data.countryStats.AU?.total,
				isActive: country === 'AU',
			},
			{
				country: 'NZ',
				label: 'New Zealand Reviews',
				data: data.countryStats.NZ?.total,
				isActive: country === 'NZ',
			},
			// {
			// 	country: 'DE',
			// 	label: 'Germany Reviews',
			// 	data: data.countryStats.DE?.total,
			// 	isActive: country === 'DE',
			// },
			// {
			// 	country: 'IE',
			// 	label: 'Ireland Reviews',
			// 	data: data.countryStats.IE?.total,
			// 	isActive: country === 'IE',
			// },
		]

		return stats.map((stat) => (
			<div
				key={stat.country}
				onClick={() => handleCountryClick(stat.country)}
				className={`flex cursor-pointer flex-col rounded-xl border p-6 text-center ${
					stat.isActive ? 'bg-gray-200' : ''
				}`}
			>
				<dt className='order-2 mt-2 text-lg  leading-6 text-gray-500'>
					{stat.label}
				</dt>
				<dd className='order-1 text-5xl   text-indigo-600'>{stat.data}</dd>
			</div>
		))
	}

	const renderSelectedStateStats = () => {
		switch (country) {
			case 'CA':
				return <StateStats states={data.countryStats.CA?.states} />
			case 'US':
				return <StateStats states={data.countryStats.US?.states} />
			case 'UK':
				return <StateStats states={data.countryStats.GB?.states} />
			case 'AU':
				return <StateStats states={data.countryStats.AU?.states} />
			case 'NZ':
				return <StateStats states={data.countryStats.NZ?.states} />
			// case 'DE':
			// 	return <StateStats states={data.countryStats.DE?.states} />
			// case 'IE':
			// 	return <StateStats states={data.countryStats.IE?.states} />
			default:
				return null
		}
	}

	return (
		<div className='container flex w-full flex-wrap justify-center px-4 sm:px-6 lg:px-8'>
			<div className='mt-3 flex w-full flex-col justify-center gap-3 lg:flex-row'>
				<div className='flex flex-col p-6 text-center'>
					<dt className='order-2 mt-2 text-lg  leading-6 text-gray-500'>
						Total Reviews
					</dt>
					<dd className='order-1 text-5xl   text-indigo-600'>
						{data.total_reviews}
					</dd>
				</div>
				{renderStats()}
			</div>
			{renderSelectedStateStats()}
		</div>
	)
}

export default TotalStats
