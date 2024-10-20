import { XIcon } from '@heroicons/react/solid'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface SearchProps {
	setSearchState: (str: string) => void
	searchTitle?: string
	value?: string
}

export default function SearchBar({
	setSearchState,
	searchTitle,
	value,
}: SearchProps) {
	const { t } = useTranslation('filters')
	return (
		<div className='mt-1 flex w-full flex-col gap-2'>
			<label htmlFor='search' className='sr-only'>
				{t('filters.search')}
			</label>
			<div className='relative'>
				<input
					type='text'
					name='search'
					id='search'
					onChange={(e) => setSearchState(e.target.value)}
					className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
					value={value}
					placeholder={
						searchTitle
							? searchTitle
							: `${t('filters.search')} ${t('filters.landlord')}`
					}
				/>
				{value?.length ? (
					<button
						className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-800'
						onClick={() => setSearchState('')}
					>
						<XIcon width={18} />
					</button>
				) : null}
			</div>
		</div>
	)
}
