import React, { Fragment } from 'react'
import {
	Dialog,
	DialogPanel,
	PopoverGroup,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import SearchBar from './ui/searchbar'
import { Options } from '@/util/interfaces/interfaces'
import { useTranslations } from 'next-intl'
import ComboBox from './ui/combobox'
import ButtonLight from '../ui/button-light'
import Button from '../ui/button'

interface FiltersProps {
	mobileFiltersOpen: boolean
	setMobileFiltersOpen: (bool: boolean) => void
	cityFilter: Options | null
	zipFilter: Options | null
	dynamicCityOptions: Options[]
	dynamicZipOptions: Options[]
	searchFilter: string
	onSearchChange: (value: string) => void
	onCityChange: (value: Options | null) => void
	onZipChange: (value: Options | null) => void
	onApply: () => void
	onClear: () => void
}

export default function MobileReviewFilters({
	mobileFiltersOpen,
	setMobileFiltersOpen,
	cityFilter,
	zipFilter,
	dynamicCityOptions,
	dynamicZipOptions,
	searchFilter,
	onSearchChange,
	onCityChange,
	onZipChange,
	onApply,
	onClear,
}: FiltersProps) {
	const t = useTranslations('reviews')

	return (
		<Transition show={mobileFiltersOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-40 lg:hidden'
				onClose={setMobileFiltersOpen}
			>
				<TransitionChild
					as={Fragment}
					enter='transition-opacity ease-linear duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='transition-opacity ease-linear duration-300'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='bg-opacity-25 fixed inset-0 bg-black' />
				</TransitionChild>

				<div
					className='fixed inset-0 z-40 flex'
					data-testid='mobile-review-filters-1'
				>
					<TransitionChild
						as={Fragment}
						enter='transition ease-in-out duration-300 transform'
						enterFrom='translate-x-full'
						enterTo='translate-x-0'
						leave='transition ease-in-out duration-300 transform'
						leaveFrom='translate-x-0'
						leaveTo='translate-x-full'
					>
						<DialogPanel className='relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl'>
							<div className='flex items-center justify-between px-4'>
								<h2 className='text-lg text-gray-900'>{t('filters')}</h2>
								<button
									type='button'
									className='-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400'
									onClick={() => setMobileFiltersOpen(false)}
								>
									<span className='sr-only'>Close menu</span>
									<XMarkIcon className='h-6 w-6' aria-hidden='true' />
								</button>
							</div>

							<div className='mt-4'>
								<PopoverGroup className='mx-2 flex flex-col items-center gap-2 divide-y'>
									<SearchBar
										setSearchState={onSearchChange}
										value={searchFilter}
									/>

									<ComboBox
										state={cityFilter}
										setState={onCityChange}
										options={dynamicCityOptions}
										name={t('city')}
									/>

									<ComboBox
										state={zipFilter}
										setState={onZipChange}
										options={dynamicZipOptions}
										name={t('zip')}
									/>

									<div className='flex w-full justify-end gap-2 pt-2'>
										<ButtonLight onClick={onClear}>{t('clear')}</ButtonLight>
										<Button onClick={onApply}>{t('update')}</Button>
									</div>
								</PopoverGroup>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	)
}
