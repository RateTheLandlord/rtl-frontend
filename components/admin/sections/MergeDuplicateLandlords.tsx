import Button from '@/components/ui/button'
import Spinner from '@/components/ui/Spinner'
import TextInput from '@/components/ui/TextInput'
import React, { useState } from 'react'
import LandlordCard from '../components/LandlordCard'
import CountrySelector from '@/components/ui/CountrySelector'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateMergeLandlordModalOpen } from '@/redux/modal/modalSlice'
import {
	updateAllLandlords,
	updateLandlordName,
} from '@/redux/landlord/landlordSlice'

export type Candidate = {
	country: string
	name: string
	count: number
	score: number
	cities: string[]
}

const MergeDuplicateLandlords = () => {
	const [isLoading, setIsLoading] = useState(false)

	const { country } = useAppSelector((state) => state.review)

	const {
		selectedLandlords,
		landlordName: landlord,
		allLandlords: data,
	} = useAppSelector((state) => state.landlord)

	const dispatch = useAppDispatch()

	const onSubmit = () => {
		setIsLoading(true)
		fetch('/api/landlord-tools/search-duplicate-landlords', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: landlord,
				country_code: country,
			}),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Error: ${res.status}`)
				}
				return res.json()
			})
			.then((data: Candidate[]) => dispatch(updateAllLandlords(data)))
			.catch((err) => console.log(err))
			.finally(() => setIsLoading(false))
	}

	return (
		<div className='container flex w-full flex-wrap justify-center gap-4'>
			<div className='flex w-full flex-row items-center gap-3'>
				<TextInput
					title='Search for Landlord'
					value={landlord}
					setValue={(str) => dispatch(updateLandlordName(str))}
					id='landlord'
				/>
				<div className='min-w-1/3'>
					<CountrySelector />
				</div>
				{isLoading ? (
					<Spinner />
				) : (
					<Button disabled={isLoading} onClick={() => onSubmit()}>
						Search
					</Button>
				)}
			</div>
			{data && (
				<div className='flex flex-col gap-4'>
					<h2 className='text-2xl font-bold'>
						Results for {landlord} in {country}
					</h2>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
						{data.map((landlord) => (
							<LandlordCard
								key={`${landlord.name}-${landlord.country}-${landlord.count}`}
								landlord={landlord}
							/>
						))}
					</div>
					<div className='flex w-full justify-end'>
						<Button
							disabled={selectedLandlords.length === 0}
							onClick={() => dispatch(updateMergeLandlordModalOpen(true))}
						>{`Merge ${selectedLandlords.length} Landlords`}</Button>
					</div>
				</div>
			)}
		</div>
	)
}

export default MergeDuplicateLandlords
