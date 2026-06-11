import React, { useState } from 'react'
import RatingStars from '@/components/ui/RatingStars'
import posthog from 'posthog-js'
import { AnalyticsResponse } from '@/lib/analytics/types'
import { useTranslations } from 'next-intl'

interface SidebarProps {
	data: AnalyticsResponse
	handleClick: (str: string) => void
}

const Sidebar = ({ data, handleClick }: SidebarProps) => {
	const t = useTranslations('analytics')
	const [isOpen, setIsOpen] = useState(false)

	const toggleSidebar = () => {
		posthog.capture('analytics_side_bar_toggled', { open: !isOpen })
		setIsOpen(!isOpen)
	}

	return (
		<div className='relative flex justify-center pt-4'>
			{/* Button to toggle the sidebar */}
			<button
				onClick={toggleSidebar}
				className={`z-50 rounded bg-[#7e9860] p-3 text-white lg:hidden ${isOpen ? 'hidden' : ''}`}
			>
				{isOpen ? t('close') : t('select-metric')}
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
						className='h-48 rounded-lg border-4 border-[#7e9860] bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
						onClick={() => handleClick('rating')}
					>
						<div className='flex justify-center pt-2 pb-4 text-center'>
							<div>
								<p className='bold text-xl underline'>{t('average-rating')}</p>
								<div className='text-center text-xs'>
									({t('select-filter')})
								</div>
							</div>
						</div>
						<div className='grid w-full grid-cols-3 gap-2'>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-[#7e9860] bg-[#7e9860]/5 text-sm'>
								<div>{t('last-90')}</div>
								<div>
									<RatingStars
										testid='AnalyticsSidebar90DayRatingStar'
										value={Math.floor(data.avgRatingT90)}
									/>
								</div>
							</div>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-[#7e9860] bg-[#7e9860]/5 text-sm'>
								<div>{t('last-180')}</div>
								<RatingStars
									testid='AnalyticsSidebar180DayRatingStar'
									value={Math.floor(data.avgRatingT180)}
								/>
							</div>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-[#7e9860] bg-[#7e9860]/5 text-sm'>
								<div>{t('last-365')}</div>
								<RatingStars
									testid='AnalyticsSidebar365DayRatingStar'
									value={Math.floor(data.avgRatingT365)}
								/>
							</div>
						</div>
					</div>
					<div className='h-4'></div>
					<div
						className='h-48 rounded-lg border-4 border-[#7e9860] bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
						onClick={() => handleClick('median')}
					>
						<div className='flex justify-center pt-2 pb-4 text-center'>
							<div>
								<p className='bold text-xl underline'>{t('median-reported')}</p>
								<div className='text-center text-xs'>
									({t('select-filter')})
								</div>
							</div>
						</div>
						<div className='grid w-full grid-cols-3 gap-2'>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-[#7e9860] bg-[#7e9860]/5 text-sm'>
								<div>{t('last-90')}</div>
								<div className='text-lg'>
									$
									{data.medianRentT90
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								</div>
							</div>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-[#7e9860] bg-[#7e9860]/5 text-sm'>
								<div>{t('last-180')}</div>
								<div className='text-lg'>
									$
									{data.medianRentT180
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								</div>
							</div>
							<div className='flex h-24 flex-col items-center justify-center rounded-lg border border-[#7e9860] bg-[#7e9860]/5 text-sm'>
								<div>{t('last-365')}</div>
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
