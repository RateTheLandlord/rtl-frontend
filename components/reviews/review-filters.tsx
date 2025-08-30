/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { IQuery, Options, SortOptions } from '@/util/interfaces/interfaces'
import SearchBar from './ui/searchbar'
import { useTranslations } from 'next-intl'
import ComboBox from './ui/combobox'
import { AppDispatch } from '@/redux/store'
import {
	clearFilters,
	clearReviewFilters,
	updateCity,
	updateCountry,
	updateSearch,
	updateState,
	updateZip,
} from '@/redux/query/querySlice'
import ButtonLight from '../ui/button-light'
import SortList from './ui/sort-list'
import Button from '../ui/button'
import { DebouncedFunc } from 'lodash'

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
	dynamicCityOptions: Options[]
	zipOptions?: Options[]
	dynamicZipOptions: Options[]
	updateParams: () => void
	dispatch: AppDispatch
	fetchDynamicFilterOptions: DebouncedFunc<() => Promise<void>>
	query: IQuery
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
	dynamicCityOptions,
	zipOptions,
	dynamicZipOptions,
	updateParams,
	dispatch,
	fetchDynamicFilterOptions,
	query,
}: FiltersProps): JSX.Element {
	const t = useTranslations('reviews')
	interface KeyDownActionEvent extends React.KeyboardEvent<HTMLDivElement> {
		key: string
	}

	const keyDownAction = (e: KeyDownActionEvent): void => {
		if (e.key === 'Enter' || e.key === 'NumpadEnter') {
			updateParams()
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

	useEffect(() => {
		dispatch(updateState(stateFilter))
		dispatch(updateCity(cityFilter))
		dispatch(updateZip(zipFilter))
	}, [cityFilter, dispatch, stateFilter, zipFilter])

	return (
		<div
			data-testid='review-filters-1'
			className='mt-6 hidden min-w-[250px] lg:block'
		>
			{/* Filters */}
			<section aria-labelledby='filter-heading'>
				<h2 id='filter-heading' className='sr-only'>
					{t('filters')}
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
											name={t('sort')}
										/>
									</div>

									<div className='py-2'>
										<ComboBox
											state={cityFilter}
											setState={(opt: Options) => dispatch(updateCity(opt))}
											options={dynamicCityOptions}
											name={t('city')}
										/>
									</div>
									<div className='py-2'>
										{zipOptions && (
											<ComboBox
												state={zipFilter}
												setState={(opt: Options) => dispatch(updateZip(opt))}
												options={dynamicZipOptions}
												name={t('zip')}
											/>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='flex w-full flex-col gap-2 border-t border-t-gray-200 py-2 lg:px-2'>
						<Button
							onClick={() => {
								updateParams()
							}}
						>
							{t('update')}
						</Button>

						<ButtonLight
							onClick={() => {
								dispatch(clearReviewFilters())
								updateParams()
							}}
						>
							{t('clear')}
						</ButtonLight>
					</div>
				</div>
			</section>
		</div>
	)
}

export default ReviewFilters
