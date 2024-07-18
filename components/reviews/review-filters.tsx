import React, { useEffect, useState } from 'react'
import { Options, SortOptions } from '@/util/interfaces/interfaces'
import SelectList from './ui/select-list'
import SearchBar from './ui/searchbar'
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
import Spinner from '../ui/Spinner'
import SortList from './ui/sort-list'
import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'

//Review filters and Logic

interface FiltersProps {
	title?: string
	description?: string
	searchTitle?: string
	selectedSort: SortOptions
	setSelectedSort: (selectedSort: SortOptions) => void
	sortOptions: SortOptions[]
	countryFilter: Options | null
	stateFilter: Options | null
	cityFilter: Options | null
	zipFilter: Options | null
	cityOptions: Options[]
	stateOptions: Options[]
	zipOptions?: Options[]
	updateParams: () => void
	loading: boolean
}

function ReviewFilters({
	selectedSort,
	sortOptions,
	setSelectedSort,
	searchTitle,
	countryFilter,
	stateFilter,
	cityFilter,
	zipFilter,
	cityOptions,
	stateOptions,
	zipOptions,
	updateParams,
	loading,
}: FiltersProps): JSX.Element {
	const { t } = useTranslation('reviews')
	const dispatch = useAppDispatch()
	const query = useAppSelector((state) => state.query)
	const [dynamicCityOptions, setDynamicCityOptions] = useState<Options[]>(cityOptions)
	const [dynamicStateOptions, setDynamicStateOptions] = useState<Options[]>(stateOptions)
	const [dynamicZipOptions, setDynamicZipOptions] = useState<Options[]>(zipOptions ?? [])
	const keyDownAction = (e) => {
		e.key === 'Enter' || e.key === 'NumpadEnter' ? updateParams() : {}
	}

	const fetchDynamicFilterOptions = async () => {
		try {
			const filterOptions = await fetchFilterOptions(countryFilter?.value, stateFilter?.value, cityFilter?.value, zipFilter?.value)
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
		<div data-testid='review-filters-1' className='mt-6 hidden lg:block'>
			{/* Filters */}
			<section aria-labelledby='filter-heading'>
				<h2 id='filter-heading' className='sr-only'>
					{t('reviews.filters')}
				</h2>

				<div className='relative z-10 bg-white pb-4'>
					<div className='mx-auto flex max-w-7xl items-center justify-between gap-2 lg:px-4'>
						<div className='hidden lg:block'>
							<div className='flow-root'>
								<div
									className='-mx-4 flex flex-col divide-y divide-gray-200'
									onKeyDown={keyDownAction}
								>
									<div className='py-2'>
										<SearchBar
											setSearchState={(str: string) =>
												dispatch(updateSearch(str))
											}
											value={query.searchFilter}
											searchTitle={searchTitle}
										/>
									</div>
									<div className='py-2'>
										<SortList
											state={selectedSort}
											setState={setSelectedSort}
											options={sortOptions}
											name={t('reviews.sort')}
										/>
									</div>

									<div className='py-2'>
										<SelectList
											state={countryFilter}
											setState={(opt: Options) => dispatch(updateCountry(opt))}
											options={countryOptions}
											name={t('reviews.country')}
										/>
									</div>
									<div className='py-2'>
										<ComboBox
											state={stateFilter}
											setState={(opt: Options) => dispatch(updateState(opt))}
											options={dynamicStateOptions}
											name={t('reviews.state')}
										/>
									</div>
									<div className='py-2'>
										<ComboBox
											state={cityFilter}
											setState={(opt: Options) => dispatch(updateCity(opt))}
											options={dynamicCityOptions}
											name={t('reviews.city')}
										/>
									</div>
									<div className='py-2'>
										{zipOptions && (
											<ComboBox
												state={zipFilter}
												setState={(opt: Options) => dispatch(updateZip(opt))}
												options={dynamicZipOptions}
												name={t('reviews.zip')}
											/>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='flex w-full flex-col gap-2 border-t border-t-gray-200 py-2 lg:px-2'>
						<button
							onClick={() => {
								updateParams()
							}}
							type='submit'
							className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm  text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${'bg-teal-600 hover:bg-teal-700'}`}
							data-testid='submit-button-1'
						>
							{loading ? (
								<Spinner height='h-4' width='w-4' colour='text-white' />
							) : (
								'Update Filters'
							)}
						</button>
						<ButtonLight
							onClick={() => {
								dispatch(clearFilters())
								updateParams()
							}}
						>
							Clear Filters
						</ButtonLight>
					</div>
				</div>
			</section>
		</div>
	)
}

export default ReviewFilters
