import React, { Fragment, useEffect, useState  } from 'react'
import { Dialog, Popover, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import MobileSelectList from './ui/mobile-select-list'
import SearchBar from './ui/searchbar'
import { Options } from '@/util/interfaces/interfaces'
import { useTranslation } from 'react-i18next'
import ComboBox from './ui/combobox'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	clearFilters,
	updateCity,
	updateCountry,
	updateSearch,
	updateState,
	updateZip,
} from '@/redux/query/querySlice'
import ButtonLight from '../ui/button-light'
import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'

interface FiltersProps {
	mobileFiltersOpen: boolean
	setMobileFiltersOpen: (bool: boolean) => void
	countryFilter: Options | null
	stateFilter: Options | null
	cityFilter: Options | null
	zipFilter: Options | null
	cityOptions: Options[]
	stateOptions: Options[]
	zipOptions?: Options[]
	updateParams: () => void
}

export default function MobileReviewFilters({
	mobileFiltersOpen,
	setMobileFiltersOpen,
	countryFilter,
	stateFilter,
	cityFilter,
	zipFilter,
	cityOptions,
	stateOptions,
	zipOptions,
	updateParams,
}: FiltersProps) {
	const dispatch = useAppDispatch()
	const query = useAppSelector((state) => state.query)
	const { t } = useTranslation('reviews')
	const [dynamicCityOptions, setDynamicCityOptions] =
		useState<Options[]>(cityOptions)
	const [dynamicStateOptions, setDynamicStateOptions] =
		useState<Options[]>(stateOptions)
	const [dynamicZipOptions, setDynamicZipOptions] = useState<Options[]>(
		zipOptions ?? [],
	)

	const fetchDynamicFilterOptions = async () => {
		try {
			const filterOptions = await fetchFilterOptions(
				countryFilter?.value,
				stateFilter?.value,
				cityFilter?.value,
				zipFilter?.value,
			)
			setDynamicCityOptions(filterOptions.cities)
			setDynamicStateOptions(filterOptions.states)
			setDynamicZipOptions(filterOptions.zips)
		} catch (error) {
			console.error('Error fetching filter options:', error)
		}
	}

	useEffect(() => {
		fetchDynamicFilterOptions()
	}, [stateFilter, cityFilter])

	useEffect(() => {
		dispatch(clearFilters())
		dispatch(updateCountry(countryFilter))
		fetchDynamicFilterOptions()
	}, [countryFilter])
	
	return (
		<Transition.Root show={mobileFiltersOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-40 lg:hidden'
				onClose={setMobileFiltersOpen}
			>
				<Transition.Child
					as={Fragment}
					enter='transition-opacity ease-linear duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='transition-opacity ease-linear duration-300'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black bg-opacity-25' />
				</Transition.Child>

				<div
					className='fixed inset-0 z-40 flex'
					data-testid='mobile-review-filters-1'
				>
					<Transition.Child
						as={Fragment}
						enter='transition ease-in-out duration-300 transform'
						enterFrom='translate-x-full'
						enterTo='translate-x-0'
						leave='transition ease-in-out duration-300 transform'
						leaveFrom='translate-x-0'
						leaveTo='translate-x-full'
					>
						<Dialog.Panel className='relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl'>
							<div className='flex items-center justify-between px-4'>
								<h2 className='text-lg  text-gray-900'>
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
								<Popover.Group className='mx-2 flex flex-col items-center gap-2 divide-y'>
									<SearchBar
										setSearchState={(str: string) =>
											dispatch(updateSearch(str))
										}
										value={query.searchFilter}
									/>

									<MobileSelectList
										state={countryFilter}
										setState={(opt: Options) => dispatch(updateCountry(opt))}
										options={countryOptions}
										name={t('reviews.country')}
									/>
									<ComboBox
										state={stateFilter}
										setState={(opt: Options) => dispatch(updateState(opt))}
										options={dynamicStateOptions}
										name={t('reviews.state')}
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
									<div className='w-full pt-2'>
										<button
											onClick={() => {
												updateParams()
												setMobileFiltersOpen(false)
											}}
											className='w-full rounded-lg bg-teal-600 py-2 text-white'
										>
											Apply Filters
										</button>
									</div>
									<div className='flex w-full justify-end pt-2'>
										<ButtonLight
											onClick={() => {
												dispatch(clearFilters())
												setMobileFiltersOpen(false)
												updateParams()
											}}
										>
											Clear Filters
										</ButtonLight>
									</div>
								</Popover.Group>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
