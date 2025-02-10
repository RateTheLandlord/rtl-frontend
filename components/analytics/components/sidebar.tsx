import React, { useState } from 'react'
import { AnalyticsResponse } from '@/lib/analytics/models/review'
import RatingStars from '@/components/ui/RatingStars'

interface SidebarProps {
	data: AnalyticsResponse
	handleClick: (string) => void
}

const Sidebar = ({ data, handleClick }: SidebarProps) => {
	const [isOpen, setIsOpen] = useState(false)

	const toggleSidebar = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div className='relative flex justify-center pt-4'>
			{/* Button to toggle the sidebar */}
			<button
				onClick={toggleSidebar}
				className={`z-50 rounded bg-teal-600 p-3 text-white lg:hidden ${isOpen ? 'hidden' : ''}`}
			>
				{isOpen ? 'Close' : 'Select Metric for Graph'}
			</button>

			{/* Sidebar */}
			<div
				className={`bg-opacity-50 fixed inset-0 z-40 transform bg-gray-800 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
				onClick={toggleSidebar}
			>
				{/* Sidebar content */}
				<div
					className={`fixed top-0 left-0 h-full w-96 transform bg-white p-4 shadow-lg transition-all duration-300 ease-in-out ${
						isOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
				>
					<div className='h-4'></div>
					<div
						className='h-48 rounded-lg border-4 border-teal-600 bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
						onClick={() => handleClick('rating')}
					>
						<div className='flex justify-center pt-2 pb-4 text-center'>
							<div>
								<p className='bold text-xl underline'>Average Rating</p>
								<div className='text-center text-xs'>(Select to Filter)</div>
							</div>
						</div>
						<div className='grid w-full grid-cols-3 gap-2'>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
								<div>Last 90 Days:</div>
								<div>
									<RatingStars
										testid='AnalyticsSidebar90DayRatingStar'
										value={Math.floor(data.avgRatingT90)}
									/>
								</div>
							</div>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
								<div>Last 180 Days:</div>
								<RatingStars
									testid='AnalyticsSidebar180DayRatingStar'
									value={Math.floor(data.avgRatingT180)}
								/>
							</div>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
								<div>Last 365 Days:</div>
								<RatingStars
									testid='AnalyticsSidebar365DayRatingStar'
									value={Math.floor(data.avgRatingT365)}
								/>
							</div>
						</div>
					</div>
					<div className='h-4'></div>
					<div
						className='h-48 rounded-lg border-4 border-teal-600 bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
						onClick={() => handleClick('median')}
					>
						<div className='flex justify-center pt-2 pb-4 text-center'>
							<div>
								<p className='bold text-xl underline'>Median Reported Rent</p>
								<div className='text-center text-xs'>(Select to Filter)</div>
							</div>
						</div>
						<div className='grid w-full grid-cols-3 gap-2'>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
								<div>Last 90 Days:</div>
								<div className='text-lg'>
									$
									{data.medianRentT90
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								</div>
							</div>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
								<div>Last 180 Days:</div>
								<div className='text-lg'>
									$
									{data.medianRentT180
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								</div>
							</div>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
								<div>Last 365 Days:</div>
								<div className='text-lg'>
									$
									{data.medianRentT365
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
