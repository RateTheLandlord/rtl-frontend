import React, { Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'

interface ComponentProps {
	name: string
	state: string | undefined
	setState: (state: string) => void
	suggestions: string[]
	isSearching: boolean
	error: boolean
	errorText: string
}

export default function LandlordComboBox({
	name,
	state,
	setState,
	suggestions,
	isSearching,
	error,
	errorText,
}: ComponentProps) {
	const comboInputClassName = `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
		error ? 'border-red-400' : ''
	}`
	return (
		<Combobox value={state} onChange={setState}>
			<div
				data-testid='create-review-form-landlord-1'
				className='relative w-full pt-2 lg:pt-0'
			>
				<label htmlFor='landlord' className='block text-sm  text-gray-700'>
					{name}
				</label>
				<Combobox.Input
					className={comboInputClassName}
					placeholder={`${name}`}
					displayValue={(state: string) => state}
					onChange={(event) => setState(event.target.value)}
				/>

				<Transition
					as={Fragment}
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<Combobox.Options className='absolute z-10 mt-1 flex max-h-60 w-60 flex-col overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
						{suggestions.length === 0 && state !== '' ? (
							isSearching ? (
								<div className='relative cursor-default select-none px-4 py-2 text-gray-700'>
									Loading...
								</div>
							) : null
						) : (
							suggestions.map((landlord) => (
								<Combobox.Option
									key={landlord}
									className={({ active }) =>
										`cursor-pointer rounded-md p-2 text-left hover:bg-teal-100 ${
											active ? 'bg-teal-200' : ''
										}`
									}
									value={landlord}
								>
									{landlord}
								</Combobox.Option>
							))
						)}
					</Combobox.Options>
				</Transition>
				{error ? <p className='text-xs text-red-400'>{errorText}</p> : null}
			</div>
		</Combobox>
	)
}
