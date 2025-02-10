import React, { Fragment } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import {
	Listbox,
	ListboxButton,
	ListboxOptions,
	Transition,
} from '@headlessui/react'
import { Options } from '@/util/interfaces/interfaces'

interface ComponentProps {
	name: string
	state: Options | null
	setState: (state: Options) => void
	options: Options[]
}

export default function SelectList({
	state,
	setState,
	options,
	name,
}: ComponentProps) {
	return (
		<Listbox value={state} onChange={setState}>
			<div className='relative w-full pt-2 lg:px-2 lg:pt-2'>
				<ListboxButton className='focus-visible:ring-opacity-75 relative w-full cursor-default rounded-lg border border-teal-600 bg-white py-2 pr-10 pl-3 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-lg'>
					<span className='block w-full truncate'>{state?.name || name}</span>
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
					<ListboxOptions
						anchor='bottom start'
						className='sm:text-md ring-opacity-5 absolute z-[999] mt-1 max-h-[250px] w-1/2 overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black focus:outline-none sm:w-1/2 md:w-8/12 lg:w-9/12 xl:w-7/12 2xl:w-5/12'
					>
						{options.map((option) => (
							<Listbox.Option
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
									{option.name}
								</span>

								{option.name === state?.name ? (
									<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
										<CheckIcon className='h-5 w-5' aria-hidden='true' />
									</span>
								) : null}
							</Listbox.Option>
						))}
					</ListboxOptions>
				</Transition>
			</div>
		</Listbox>
	)
}
