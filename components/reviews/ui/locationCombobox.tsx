import React, { Fragment, useRef, useState } from 'react'
import { SelectorIcon } from '@heroicons/react/solid'
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Transition,
} from '@headlessui/react'
import { Options } from '@/util/interfaces/interfaces'
import { useVirtualizer } from '@tanstack/react-virtual'

interface ComponentProps {
	name: string
	state: Options | null
	setState: (state: Options) => void
	options: Options[]
	testid?: string
}

export default function ComboBox({
	state,
	setState,
	options,
	name,
	testid,
}: ComponentProps) {
	const [query, setQuery] = useState('')
	const filterOptions =
		query === ''
			? options
			: options.filter((option) =>
					option.name
						.toLowerCase()
						.replace(/\s+/g, '')
						.includes(query.toLowerCase().replace(/\s+/g, '')),
				)
	return (
		<Combobox
			data-testid={testid || 'location-test'}
			value={state}
			onChange={setState}
		>
			<div className='relative w-full pt-2 lg:px-2 lg:pt-2'>
				<div className='focus-visible:ring-opacity-75 relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
					<ComboboxInput
						className='focus-visible:ring-opacity-75 relative w-full cursor-default rounded-lg border border-teal-600 bg-white py-2 pr-10 pl-3 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-lg'
						displayValue={(state: Options) => state?.name}
						placeholder={`Search ${name}`}
						onChange={(event) => setQuery(event.target.value)}
					/>
					<ComboboxButton
						aria-label='Select Location'
						className='absolute inset-y-0 right-0 flex items-center pr-2'
					>
						<SelectorIcon
							className='h-5 w-5 text-gray-400'
							aria-hidden='true'
						/>
					</ComboboxButton>
				</div>
				<Transition
					as={Fragment}
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<ComboboxOptions className='sm:text-md ring-opacity-5 absolute z-10 mt-1 max-h-60 w-9/12 overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black focus:outline-none sm:w-1/2 md:w-8/12 lg:w-9/12 xl:w-7/12 2xl:w-7/12'>
						{filterOptions.length === 0 && query !== '' ? (
							<div className='relative cursor-default px-4 py-2 text-gray-700 select-none'>
								Nothing found.
							</div>
						) : (
							<VirtualizedList items={filterOptions ?? []} />
						)}
					</ComboboxOptions>
				</Transition>
			</div>
		</Combobox>
	)
}

function VirtualizedList({ items }: { items: Options[] }) {
	const parentRef = useRef<HTMLDivElement>(null)

	const rowVirtualizer = useVirtualizer({
		count: items?.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 35,
		overscan: 5,
	})

	return (
		<div ref={parentRef}>
			<div
				style={{
					height: `${rowVirtualizer.getTotalSize()}px`,
					width: '100%',
					position: 'relative',
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow) => (
					<ComboboxOption
						key={virtualRow.index}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: `${virtualRow.size}px`,
							transform: `translateY(${virtualRow.start}px)`,
						}}
						className={({ active }) =>
							`relative cursor-default py-2 pr-4 pl-10 select-none ${
								active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
							}`
						}
						value={items?.[virtualRow.index]}
					>
						{({ selected }) => (
							<span
								className={`block truncate ${
									selected
										? 'font-montserrat-medium'
										: 'font-montserrat-regular'
								}`}
							>
								{items?.[virtualRow.index].name}
							</span>
						)}
					</ComboboxOption>
				))}
			</div>
		</div>
	)
}
