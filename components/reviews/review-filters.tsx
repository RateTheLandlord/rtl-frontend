import React, { type JSX, type KeyboardEvent } from 'react'
import { Options, SortOptions } from '@/util/interfaces/interfaces'
import SearchBar from './ui/searchbar'
import { useTranslations } from 'next-intl'
import ComboBox from './ui/combobox'
import ButtonLight from '../ui/button-light'
import SortList from './ui/sort-list'
import Button from '../ui/button'

interface FiltersProps {
	selectedSort: SortOptions | null
	setSelectedSort: (selectedSort: SortOptions | null) => void
	sortOptions: SortOptions[]
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
	searchTitle?: string
}

function ReviewFilters({
	selectedSort,
	setSelectedSort,
	sortOptions,
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
	searchTitle,
}: FiltersProps): JSX.Element {
	const t = useTranslations('reviews')

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (
			(event.key === 'Enter' || event.key === 'NumpadEnter') &&
			event.target instanceof HTMLElement &&
			event.target.tagName === 'INPUT'
		) {
			event.preventDefault()
			onApply()
		}
	}

	return (
		<div
			data-testid='review-filters-1'
			className='mt-6 hidden min-w-[250px] lg:block'
		>
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
									onKeyDown={handleKeyDown}
								>
									<div className='py-2'>
										<SearchBar
											setSearchState={onSearchChange}
											value={searchFilter}
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
											setState={onCityChange}
											options={dynamicCityOptions}
											name={t('city')}
										/>
									</div>

									<div className='py-2'>
										<ComboBox
											state={zipFilter}
											setState={onZipChange}
											options={dynamicZipOptions}
											name={t('zip')}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='flex w-full flex-col gap-2 border-t border-t-gray-200 py-2 lg:px-2'>
						<Button onClick={onApply}>{t('update')}</Button>
						<ButtonLight onClick={onClear}>{t('clear')}</ButtonLight>
					</div>
				</div>
			</section>
		</div>
	)
}

export default ReviewFilters
