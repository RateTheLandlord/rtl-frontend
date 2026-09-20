import React from 'react'
import { Candidate } from '../sections/MergeDuplicateLandlords'
import { classNames } from '@/util/helpers/helper-functions'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateLandlord } from '@/redux/landlord/landlordSlice'

const LandlordCard = ({ landlord }: { landlord: Candidate }) => {
	const { selectedLandlords } = useAppSelector((state) => state.landlord)

	const dispatch = useAppDispatch()
	return (
		<div
			onClick={() => dispatch(updateLandlord(landlord))}
			className={classNames(
				'relative flex cursor-pointer items-center space-x-3 rounded-lg px-6 py-5',
				'border-2 hover:border-blue-500',
				selectedLandlords.some((selected) => selected.name === landlord.name)
					? 'border-blue-500'
					: 'border-gray-500',
			)}
		>
			<input
				checked={selectedLandlords.some(
					(selected) => selected.name === landlord.name,
				)}
				name='privacy-setting'
				type='checkbox'
				className='relative mt-0.5 size-4 shrink-0 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden'
			/>
			<div className='min-w-0 flex-1'>
				<div className='focus:outline-hidden'>
					<span aria-hidden='true' className='absolute inset-0' />
					<p className='text-sm font-medium text-black'>
						Name: {landlord.name}
					</p>
					<p className='truncate text-sm text-black'>
						Match Score: {(landlord.score * 100).toFixed(2)}%
					</p>
					<p className='truncate text-sm text-black'>
						Country: {landlord.country}
					</p>
					<p className='truncate text-sm text-black'>
						Cities: {landlord.cities.join(', ')}
					</p>
					<p className='truncate text-sm text-black'>
						Number of reviews: {landlord.count}
					</p>
				</div>
			</div>
		</div>
	)
}

export default LandlordCard
