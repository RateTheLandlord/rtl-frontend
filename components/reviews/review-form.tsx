/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from 'react'
import Button from '../ui/button'
import Spinner from '../ui/Spinner'
import LocationForm from './components/LocationForm'
import { Review as IReview } from '@/util/interfaces/interfaces'
import Review from './review'

export type ReviewsResponse = {
	reviews: IReview[]
	total: number
	countries: string[]
	states: string[]
	cities: string[]
	zips: string[]
	limit: number
}

function ReviewForm({ data }: { data: ReviewsResponse }): JSX.Element {
	const [locationOpen, setLocationOpen] = useState<boolean>(true)
	const [loading, setLoading] = useState<boolean>(false)

	const handleSubmit = async () => {
		setLoading(true)
		setLocationOpen(false)
		setLoading(true)
	}

	return !locationOpen ? (
		<Review data={data} />
	) : (
		<div>
			<div className='w-full border-b-2 border-b-teal-600 p-4 transition-all duration-500'>
				<LocationForm data={data} />
			</div>
			<div className='flex justify-center gap-5 pt-5 sm:gap-3'>
				{loading ? (
					<Spinner />
				) : (
					<Button disabled={false} onClick={() => handleSubmit()}>
						Continue
					</Button>
				)}
			</div>
		</div>
	)
}

export default ReviewForm
