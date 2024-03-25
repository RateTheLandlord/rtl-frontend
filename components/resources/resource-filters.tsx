import React from 'react'
import { Options, SortOptions } from '@/util/interfaces/interfaces'
import SelectList from '@/components/reviews/ui/select-list'
import SearchBar from '@/components/reviews/ui/searchbar'
import { useTranslation } from 'react-i18next'
import ButtonLight from '../ui/button-light'
import ComboBox from '@/components/reviews/ui/combobox'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	clearResourceFilters,
	updateResourceCity,
	updateResourceCountry,
	updateResourceSearch,
	updateResourceState,
} from '@/redux/resourceQuery/resourceQuerySlice'
import SortList from '../reviews/ui/sort-list'
import Spinner from '../ui/Spinner'

//Review filters and Logic

interface FiltersProps {
	searchTitle?: string
	selectedSort: SortOptions
	setSelectedSort: (selectedSort: SortOptions) => void
	sortOptions: SortOptions[]
	countryFilter: Options | null
	stateFilter: Options | null
	cityFilter: Options | null
	cityOptions: Options[]
	stateOptions: Options[]
	zipOptions?: Options[]
	resource?: boolean
	loading: boolean
	updateParams: () => void
}

function ResourceFilters({
	searchTitle,
	selectedSort,
	setSelectedSort,
	sortOptions,
	countryFilter,
	stateFilter,
	cityFilter,
	cityOptions,
	stateOptions,
	resource,
	loading,
	updateParams,
}: FiltersProps): JSX.Element {
	const { t } = useTranslation('reviews')

	const dispatch = useAppDispatch()
	const query = resource
		? useAppSelector((state) => state.resourceQuery)
		: useAppSelector((state) => state.query)

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
								<div className='-mx-4 flex flex-col divide-y divide-gray-200'>
									<div className='py-2'>
										<SearchBar
											setSearchState={(str: string) =>
												dispatch(updateResourceSearch(str))
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
											setState={(opt: Options) =>
												dispatch(updateResourceCountry(opt))
											}
											options={countryOptions}
											name={t('reviews.country')}
										/>
									</div>
									<div className='py-2'>
										<ComboBox
											state={stateFilter}
											setState={(opt: Options) =>
												dispatch(updateResourceState(opt))
											}
											options={stateOptions}
											name={t('reviews.state')}
										/>
									</div>
									<div className='py-2'>
										<ComboBox
											state={cityFilter}
											setState={(opt: Options) =>
												dispatch(updateResourceCity(opt))
											}
											options={cityOptions}
											name={t('reviews.city')}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='flex w-full flex-col gap-2 border-t border-t-gray-200 py-2 lg:px-2'>
						<button
							data-umami-event='Update Filters'
							onClick={() => updateParams()}
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
							umami='Mobile / Reset Filters'
							onClick={() => {
								dispatch(clearResourceFilters())
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

export default ResourceFilters
