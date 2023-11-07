import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Resource } from '@/util/interfaces/interfaces'
import Spinner from '../ui/Spinner'

interface IProps {
	data: Resource[]
	setPage: Dispatch<SetStateAction<number>>
	hasMore: boolean
	isLoading: boolean
	setIsLoading: Dispatch<SetStateAction<boolean>>
}

function InfiniteScroll({
	data,
	setPage,
	hasMore,
	isLoading,
	setIsLoading,
}: IProps) {
	const [content, setContent] = useState<Resource[]>([]) // Store loaded content: ;
	// Add a scroll event listener
	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Fetch more content when reaching the bottom
	const handleScroll = () => {
		if (
			window.innerHeight + window.scrollY >= document.body.offsetHeight &&
			!isLoading &&
			hasMore
		) {
			setIsLoading(true)
			// Fetch more content here
			// Update state with the loaded content and adjust page, hasMore, isLoading accordingly
			setPage((page) => page + 1)
		}
	}

	// Fetch initial content when the component mounts
	useEffect(() => {
		// Fetch initial content here
		// Update state with the loaded content and adjust hasMore, isLoading accordingly
		setContent(data)
	}, [data])

	return (
		<div className='w-full'>
			<ul
				role='list'
				className='mt-4 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8'
			>
				{content.map((resource) => (
					<li
						key={resource.id}
						className='overflow-hidden rounded-xl border border-gray-200 hover:border-teal-500'
					>
						<a href={resource.href}>
							<div className='flex flex-col items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6'>
								<div className='text-xl font-medium leading-6 text-gray-900'>
									{resource.name}
								</div>
								<div className='text-xs font-medium leading-6 text-gray-900'>
									{`${resource.city.length > 0 ? `${resource.city}, ` : ''}${
										resource.state ? `${resource.state}, ` : ''
									}${resource.country_code}`}
								</div>
							</div>
							<dl className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
								{resource.address && (
									<div className='flex justify-between gap-x-4 py-3'>
										<dt className='text-gray-500'>Address</dt>
										<dd className='text-gray-700'>{resource.address}</dd>
									</div>
								)}
								{resource.phone_number && (
									<div className='flex justify-between gap-x-4 py-3'>
										<dt className='text-gray-500'>Phone Number</dt>
										<dd className='text-gray-700'>{resource.phone_number}</dd>
									</div>
								)}
								<div className='flex justify-between gap-x-4 py-3'>
									<dd className='flex items-start gap-x-2'>
										<div className='font-medium text-gray-700'>
											{resource.description}
										</div>
									</dd>
								</div>
							</dl>
						</a>
					</li>
				))}
			</ul>
			{isLoading && (
				<div className='flex w-full justify-center py-5'>
					<Spinner />
				</div>
			)}
		</div>
	)
}

export default InfiniteScroll
