import React, { Fragment } from 'react'
import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Transition,
} from '@headlessui/react'
import { LandlordSuggestion } from '@/lib/review/landlords'

interface ComponentProps {
	name: string
	state: string | undefined
	setState: (state: string) => void
	suggestions: LandlordSuggestion[]
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
	const comboInputClassName = `mt-1 bg-white block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
		error ? 'border-red-400' : ''
	}`
	return (
		<Combobox value={state} onChange={setState}>
			<div
				data-testid='create-review-form-landlord-1'
				className='relative w-full pt-2 lg:pt-0'
			>
				<ComboboxInput
					data-testid='LandlordComboBox-component'
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
					<ComboboxOptions className='ring-opacity-5 absolute z-10 mt-1 flex max-h-60 w-full flex-col overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm'>
						{suggestions.length === 0 && state !== '' ? (
							isSearching ? (
								<div className='relative cursor-default px-4 py-2 text-gray-700 select-none'>
									Loading...
								</div>
							) : null
						) : (
							suggestions.map((landlord) => (
								<ComboboxOption
									key={landlord.landlord}
									className={({ active }) =>
										`cursor-pointer rounded-md p-2 text-left font-bold empty:invisible ${
											active ? 'bg-primary text-white' : ''
										}`
									}
									value={landlord.landlord}
								>
									{landlord.landlord}{' '}
									<span className='text-xs font-light'>{` - ${landlord.state}, ${landlord.country_code}`}</span>
								</ComboboxOption>
							))
						)}
					</ComboboxOptions>
				</Transition>
				{error ? <p className='text-xs text-red-400'>{errorText}</p> : null}
			</div>
		</Combobox>
	)
}
