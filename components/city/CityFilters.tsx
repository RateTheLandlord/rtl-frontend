import React from 'react'
import { Options, SortOptions } from '@/util/interfaces/interfaces'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearFilters, updateSearch, updateZip } from '@/redux/query/querySlice'
import ButtonLight from '../ui/button-light'
import Spinner from '../ui/Spinner'
import SearchBar from '../reviews/ui/searchbar'
import SortList from '../reviews/ui/sort-list'
import ComboBox from '../reviews/ui/combobox'

//Review filters and Logic

interface FiltersProps {
	title?: string
	description?: string
	searchTitle?: string
	selectedSort: SortOptions
	setSelectedSort: (selectedSort: SortOptions) => void
	sortOptions: SortOptions[]
	zipFilter: Options | null
	zipOptions?: Options[]
	updateParams: () => void
	loading: boolean
}

function CityFilters({
	selectedSort,
	sortOptions,
	setSelectedSort,
	searchTitle,
	zipFilter,
	zipOptions,
	updateParams,
	loading,
}: FiltersProps): JSX.Element {
	const { t } = useTranslation('reviews')

	const dispatch = useAppDispatch()
	const query = useAppSelector((state) => state.query)

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
										{zipOptions && (
											<ComboBox
												state={zipFilter}
												setState={(opt: Options) => dispatch(updateZip(opt))}
												options={zipOptions}
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

export default CityFilters
