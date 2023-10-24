import React, { useState } from 'react'
import { Options } from '@/util/interfaces/interfaces'
import SelectList from './ui/select-list'
import ActiveFilters from './ui/active-filters'
import SearchBar from './ui/searchbar'
import MobileReviewFilters from './mobile-review-filters'
import { useTranslation } from 'react-i18next'
import ButtonLight from '../ui/button-light'
import ComboBox from './ui/combobox'
import { countryOptions } from '@/util/helpers/getCountryCodes'

//Review filters and Logic

interface FiltersProps {
	title?: string
	description?: string
	searchTitle?: string
	selectedSort: Options
	setSelectedSort: (selectedSort: Options) => void
	sortOptions: Options[]
	countryFilter: Options | null
	setCountryFilter: (option: Options) => void
	stateFilter: Options | null
	setStateFilter: (option: Options) => void
	cityFilter: Options | null
	setCityFilter: (option: Options) => void
	zipFilter: Options | null
	setZipFilter: (option: Options) => void
	activeFilters: Options[] | null
	cityOptions: Options[]
	stateOptions: Options[]
	zipOptions?: Options[]
	removeFilter: (index: number) => void
	setSearchState: (str: string) => void
}

function ReviewFilters({
	title,
	description,
	searchTitle,
	selectedSort,
	setSelectedSort,
	sortOptions,
	countryFilter,
	setCountryFilter,
	stateFilter,
	setStateFilter,
	cityFilter,
	setCityFilter,
	zipFilter,
	setZipFilter,
	activeFilters,
	cityOptions,
	stateOptions,
	zipOptions,
	removeFilter,
	setSearchState,
}: FiltersProps): JSX.Element {
	const { t } = useTranslation('reviews')

	const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false)

	return (
		<div data-testid='review-filters-1'>
			{/* Mobile Filters */}
			<MobileReviewFilters
				mobileFiltersOpen={mobileFiltersOpen}
				setMobileFiltersOpen={setMobileFiltersOpen}
				countryFilter={countryFilter}
				setCountryFilter={setCountryFilter}
				stateFilter={stateFilter}
				setStateFilter={setStateFilter}
				stateOptions={stateOptions}
				cityFilter={cityFilter}
				setCityFilter={setCityFilter}
				cityOptions={cityOptions}
				zipFilter={zipFilter}
				setZipFilter={setZipFilter}
				zipOptions={zipOptions}
				setSearchState={setSearchState}
			/>

			<div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
				{/* TITLE AND DESCRIPTION */}
				<div>
					<div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
						<h1 className='text-3xl font-extrabold tracking-tight text-gray-900'>
							{title ? title : t('reviews.title')}
						</h1>
						<p className='mt-4 max-w-xl text-sm text-gray-700'>
							{description ? description : t('reviews.body')}
						</p>
					</div>
				</div>

				{/* Filters */}
				<section aria-labelledby='filter-heading'>
					<h2 id='filter-heading' className='sr-only'>
						{t('reviews.filters')}
					</h2>

					<div className='relative z-10 border-b border-gray-200 bg-white pb-4'>
						<div className='mx-auto flex max-w-7xl items-center justify-between gap-2 px-4'>
							<SelectList
								state={selectedSort}
								setState={setSelectedSort}
								options={sortOptions}
								name={t('reviews.sort')}
							/>
							<div className='block lg:hidden'>
								<ButtonLight
									onClick={() => setMobileFiltersOpen(true)}
									umami='Reviews / Review Filters'
								>
									{t('reviews.filters')}
								</ButtonLight>
							</div>

							<div className='hidden lg:block'>
								<div className='flow-root'>
									<div className='-mx-4 flex items-center divide-x divide-gray-200'>
										<SearchBar
											setSearchState={setSearchState}
											searchTitle={searchTitle}
										/>

										<SelectList
											state={countryFilter}
											setState={setCountryFilter}
											options={countryOptions}
											name={t('reviews.country')}
										/>
										<ComboBox
											state={stateFilter}
											setState={setStateFilter}
											options={stateOptions}
											name={t('reviews.state')}
										/>
										<ComboBox
											state={cityFilter}
											setState={setCityFilter}
											options={cityOptions}
											name={t('reviews.city')}
										/>
										{zipOptions && (
											<ComboBox
												state={zipFilter}
												setState={setZipFilter}
												options={zipOptions}
												name={t('reviews.zip')}
											/>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Active filters */}
					<div className='bg-gray-100'>
						<div className='mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8'>
							<h3 className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
								{t('reviews.filters')}
								<span className='sr-only'>, active</span>
							</h3>

							<div
								aria-hidden='true'
								className='hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block'
							/>

							<div className='mt-2 sm:ml-4 sm:mt-0'>
								<div className='-m-1 flex flex-wrap items-center'>
									{activeFilters?.length
										? activeFilters.map((activeFilter, index) => (
												<ActiveFilters
													key={activeFilter.value}
													activeFilter={activeFilter}
													index={index}
													removeFilter={removeFilter}
												/>
												// eslint-disable-next-line no-mixed-spaces-and-tabs
										  ))
										: null}
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

export default ReviewFilters
