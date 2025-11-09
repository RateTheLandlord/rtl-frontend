import React, { Fragment } from 'react'
import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Transition,
} from '@headlessui/react'
import { ILocationHookResponse } from '@/util/interfaces/interfaces'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateCity } from '@/redux/review/reviewSlice'
import { updateCity as updateResourceCity } from '@/redux/resource/resourceSlice'

interface ComponentProps {
	name: string
	options: ILocationHookResponse[]
	searching: boolean
	error: boolean
	errorText: string
	isResource?: boolean
}

export default function CityComboBox({
	options,
	name,
	searching,
	error,
	errorText,
	isResource,
}: ComponentProps) {
	const { city, province } = useAppSelector((state) => state.review)
	const { city: cityResource, state } = useAppSelector(
		(state) => state.resource,
	)
	const dispatch = useAppDispatch()
	const comboboxClassName = `mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
		error ? 'border-red-400' : ''
	}`
	return (
		<div className='mx-0.5 sm:col-span-1'>
			<Combobox
				value={isResource ? cityResource : city}
				onChange={(value) =>
					isResource
						? dispatch(updateResourceCity(value || ''))
						: dispatch(updateCity(value || ''))
				}
			>
				<div
					data-testid='create-review-form-city-1'
					className='relative w-full'
				>
					<label htmlFor='city' className='block text-sm text-gray-700'>
						{name}
					</label>
					<ComboboxInput
						data-testid='CityComboBox-component'
						className={comboboxClassName}
						placeholder={`${name}`}
						displayValue={(state: string) => state}
						onChange={(event) => dispatch(updateCity(event.target.value))}
					/>

					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<ComboboxOptions className='ring-opacity-5 absolute z-10 mt-1 flex max-h-60 w-60 flex-col overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm'>
							{options.length === 0 &&
							(isResource ? state !== '' : province !== '') ? (
								searching ? (
									<div className='relative cursor-default px-4 py-2 text-gray-700 select-none'>
										Loading...
									</div>
								) : (
									<div className='relative cursor-default px-4 py-2 text-gray-700 select-none'>
										City Not Found
									</div>
								)
							) : (
								options.map((option) => (
									<ComboboxOption
										key={option.id}
										className={({ active }) =>
											`cursor-pointer rounded-md p-2 text-left hover:bg-teal-100 ${
												active ? 'bg-teal-200' : ''
											}`
										}
										value={option.city}
									>
										{option.city}
									</ComboboxOption>
								))
							)}
						</ComboboxOptions>
					</Transition>
					{error ? <p className='text-xs text-red-400'>{errorText}</p> : null}
				</div>
			</Combobox>
		</div>
	)
}
