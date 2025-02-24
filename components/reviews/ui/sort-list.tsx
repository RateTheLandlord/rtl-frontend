import React, { Fragment } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition,
} from '@headlessui/react'
import { SortOptions } from '@/util/interfaces/interfaces'
import { useTranslations } from 'next-intl'

interface ComponentProps {
	name: string
	state: SortOptions | null
	setState: (state: SortOptions) => void
	options: SortOptions[]
}

export default function SortList({
	state,
	setState,
	options,
	name,
}: ComponentProps) {
	const t = useTranslations('sort')
	return (
		<Listbox data-testid='sort-list-test' value={state} onChange={setState}>
			<div className='px-2'>
				<ListboxButton
					aria-label='Select Sort'
					className='focus-visible:ring-opacity-75 relative w-full cursor-default rounded-lg bg-white py-2 pr-10 pl-3 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'
				>
					<span className='block w-full truncate'>
						{t(state?.name || name)}
					</span>
					<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
						<SelectorIcon
							className='h-5 w-5 text-gray-400'
							aria-hidden='true'
						/>
					</span>
				</ListboxButton>
				<Transition
					as={Fragment}
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<ListboxOptions className='ring-opacity-5 absolute z-50 mt-1 max-h-60 w-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm'>
						{options.map((option) => (
							<ListboxOption
								key={option.id}
								className={({ active }) =>
									`relative cursor-default py-2 pr-4 pl-10 select-none ${
										active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
									}`
								}
								value={option}
							>
								<span
									className={`block truncate ${
										option.name === state?.name
											? 'font-montserrat-medium'
											: 'font-montserrat-regular'
									}`}
								>
									{t(option.name)}
								</span>

								{option.name === state?.name ? (
									<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
										<CheckIcon className='h-5 w-5' aria-hidden='true' />
									</span>
								) : null}
							</ListboxOption>
						))}
					</ListboxOptions>
				</Transition>
			</div>
		</Listbox>
	)
}
