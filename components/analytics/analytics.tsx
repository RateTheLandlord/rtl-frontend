import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'
import { Options } from '@/util/interfaces/interfaces'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import Spinner from '@/components/ui/Spinner'
import useSWR from 'swr'
import { fetchWithBody } from '@/util/helpers/fetcher'
import { AnalyticsResponse } from '@/lib/analytics/models/review'


interface AnalyticProps {
	countryFilter: Options | null
	stateFilter: Options | null
	cityFilter: Options | null
	zipFilter: Options | null
	landlordFilter: string | undefined
}

const AnalyticsComponent = ({ 
	countryFilter,
	stateFilter,
	cityFilter,
	zipFilter,
	landlordFilter 

}: AnalyticProps) => {
	const { t } = useTranslation('reviews')
	// Consolidate related states
	const [formData, setFormData] = useState({
		zipcode: zipFilter as Options | null,
		city: cityFilter as Options | null,
		country: countryFilter as Options | null,
		state: stateFilter as Options | null,
		landlord: landlordFilter as string | null
	})

	const { data, error } = useSWR<AnalyticsResponse, Error>(
		['/api/review/review-analytics', { landlordFilter, stateFilter, countryFilter, cityFilter, zipFilter }],
		fetchWithBody,
	)


	const fetchDynamicFilterOptions = async () => {
		try {
			const filterOptions = await fetchFilterOptions(
				formData.country?.value,
				formData.state?.value,
				'',
				'',
			)
			setFormData((prevData) => ({
				...prevData,
				dynamicStateOptions: filterOptions.states,
			}))
		} catch (error) {
			console.error('Error fetching filter options:', error)
		}
	}

	if (!data) {
		return <Spinner />
	}

	return (
		<div className='grid w-full grid-cols-2'>
			<div className='flex-1'>
				left column
			</div>
			<div className='flex-1'>
				<div className='h-4'></div>
				<div className='border p-4'>
					<div className='flex items-center justify-center text-xl pb-12 pt-2 underline bold'>Total Reviews</div>
					<div className='grid w-full grid-cols-3 border-b'>
						<div className='flex flex-col items-center justify-center text-lg border'>
							<div>Last 90 Days:</div>
							<div>{data.totalReviewsT90.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
						</div>
						<div className='flex flex-col items-center justify-center text-lg border'>
							<div>Last 180 Days:</div>
							{data.totalReviewsT180.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						</div>
						<div className='flex flex-col items-center justify-center text-lg border'>
							<div>Last 360 Days:</div>
							{data.totalReviewsT360.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						</div>
					</div>
				</div>
				<div className='h-4'></div>
				<div className='border p-4'>
					<div className='flex items-center justify-center text-xl pb-12 pt-2 underline bold'>Average Rating</div>
					<div className='grid w-full grid-cols-3 border-b'>
						<div className='flex flex-col items-center justify-center text-lg border'>
							<div>Last 90 Days:</div>
							<div>{data.totalReviewsT90.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
						</div>
						<div className='flex flex-col items-center justify-center text-lg border'>
							<div>Last 180 Days:</div>
							{data.totalReviewsT180.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						</div>
						<div className='flex flex-col items-center justify-center text-lg border'>
							<div>Last 360 Days:</div>
							{data.totalReviewsT360.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						</div>
					</div>
				</div>
				<div className='h-4'></div>
				<div className='border p-4'>
					<div className='flex items-center justify-center text-xl pb-12 pt-2 underline bold'>Median Reported Rent</div>
					<div className='grid w-full grid-cols-3 border-b'>
						<div className='flex flex-col items-center justify-center text-lg border'>
							<div>Last 90 Days:</div>
							<div>{data.totalReviewsT90.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
						</div>
						<div className='flex flex-col items-center justify-center text-lg border'>
							<div>Last 180 Days:</div>
							{data.totalReviewsT180.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						</div>
						<div className='flex flex-col items-center justify-center text-lg border'>
							<div>Last 360 Days:</div>
							{data.totalReviewsT360.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AnalyticsComponent
