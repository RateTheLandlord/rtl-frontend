import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/solid'
import { Options } from '@/util/interfaces/interfaces'

interface IProps {
	selected: Options
	setSelected: (opt: Options) => void
	options: Options[]
}

export default function StatsDropdown({
	options,
	selected,
	setSelected,
}: IProps) {
	return (
		<div className='w-72'>
			<Listbox value={selected} onChange={setSelected}>
				<div className='relative mt-1'>
					<Listbox.Button className='relative w-full cursor-default rounded-lg bg-white py-2 pr-10 pl-3 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
						<span className='block truncate'>{selected.name}</span>
						<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
							<ChevronDownIcon
								className='h-5 w-5 text-gray-400'
								aria-hidden='true'
							/>
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none sm:text-sm'>
							{options.map((option, optionIdx) => (
								<Listbox.Option
									key={optionIdx}
									className={({ active }) =>
										`relative cursor-default py-2 pr-4 pl-10 select-none ${
											active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
										}`
									}
									value={option}
								>
									{({ selected }) => (
										<>
											<span
												className={`block truncate ${
													selected
														? 'font-montserrat-medium'
														: 'font-montserrat-regular'
												}`}
											>
												{option.name}
											</span>
											{selected ? (
												<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
													<CheckIcon className='h-5 w-5' aria-hidden='true' />
												</span>
											) : null}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	)
}
