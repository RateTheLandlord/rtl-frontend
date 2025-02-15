/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react'
import {
	Dialog,
	DialogPanel,
	PopoverGroup,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import SearchBar from './ui/searchbar'
import { Options, IQuery } from '@/util/interfaces/interfaces'
import { useTranslation } from 'next-i18next'
import ComboBox from './ui/combobox'
import { AppDispatch } from '@/redux/store'
import {
	clearFilters,
	clearReviewFilters,
	updateCity,
	updateCountry,
	updateSearch,
	updateZip,
} from '@/redux/query/querySlice'
import ButtonLight from '../ui/button-light'
import Button from '../ui/button'

interface FiltersProps {
	mobileFiltersOpen: boolean
	setMobileFiltersOpen: (bool: boolean) => void
	countryFilter: Options | null
	stateFilter: Options | null
	cityFilter: Options | null
	zipFilter: Options | null
	dynamicCityOptions: Options[]
	zipOptions?: Options[]
	dynamicZipOptions: Options[]
	updateParams: () => void
	dispatch: AppDispatch
	fetchDynamicFilterOptions: () => Promise<void>
	query: IQuery
}

export default function MobileReviewFilters({
	mobileFiltersOpen,
	setMobileFiltersOpen,
	countryFilter,
	stateFilter,
	cityFilter,
	zipFilter,
	dynamicCityOptions,
	zipOptions,
	dynamicZipOptions,
	updateParams,
	dispatch,
	fetchDynamicFilterOptions,
	query,
}: FiltersProps) {
	const { t } = useTranslation('reviews')

	useEffect(() => {
		fetchDynamicFilterOptions()
	}, [stateFilter, cityFilter])

	useEffect(() => {
		dispatch(clearFilters())
		dispatch(updateCountry(countryFilter))
		fetchDynamicFilterOptions()
	}, [countryFilter])

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
								<h2 className='text-lg text-gray-900'>
									{t('reviews.filters')}
								</h2>
								<button
									type='button'
									className='-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400'
									onClick={() => setMobileFiltersOpen(false)}
								>
									<span className='sr-only'>Close menu</span>
									<XIcon className='h-6 w-6' aria-hidden='true' />
								</button>
							</div>

							{/* Filters */}
							<div className='mt-4'>
								<PopoverGroup className='mx-2 flex flex-col items-center gap-2 divide-y'>
									<SearchBar
										setSearchState={(str: string) =>
											dispatch(updateSearch(str))
										}
										value={query.searchFilter}
									/>

									<ComboBox
										state={cityFilter}
										setState={(opt: Options) => dispatch(updateCity(opt))}
										options={dynamicCityOptions}
										name={t('reviews.city')}
									/>
									{zipOptions && (
										<ComboBox
											state={zipFilter}
											setState={(opt: Options) => dispatch(updateZip(opt))}
											options={dynamicZipOptions}
											name={t('reviews.zip')}
										/>
									)}
									<div className='flex w-full justify-end gap-2 pt-2'>
										<ButtonLight
											onClick={() => {
												dispatch(clearReviewFilters())
												setMobileFiltersOpen(false)
												updateParams()
											}}
										>
											Clear Filters
										</ButtonLight>
										<Button
											onClick={() => {
												updateParams()
												setMobileFiltersOpen(false)
											}}
										>
											Apply Filters
										</Button>
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
