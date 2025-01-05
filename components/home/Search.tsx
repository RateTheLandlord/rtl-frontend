import { useAppDispatch } from '@/redux/hooks'
import { updateSearch } from '@/redux/query/querySlice'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'
import { Combobox, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { useTranslation } from 'next-i18next'

const Search = () => {
	const { t } = useTranslation('filters')
	const dispatch = useAppDispatch()
	const router = useRouter()
	const [search, setSearch] = useState('')

	const {
		isSearching,
		landlordSuggestions: suggestions,
	}: { isSearching: boolean; landlordSuggestions: Array<string> } =
		useLandlordSuggestions(search)

	const submitCombo = (e) => {
		dispatch(updateSearch(e))
		router.push(`/landlord/${encodeURIComponent(e)}`)
	}
	return (
		<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			<div className='sm:flex'>
				<Combobox value={search} onChange={submitCombo}>
					<div data-testid='landlord-search-form' className='relative w-full'>
						<label
							htmlFor='landlord'
							className='sr-only block text-sm text-gray-700'
						>
							{`${t('filters.search')} ${t('filters.landlord')}`}
						</label>
						<Combobox.Input
							className='block w-full rounded-md border-0 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-500'
							placeholder={t('filters.search-placeholder')}
							displayValue={(state: string) => state}
							onChange={(event) => setSearch(event.target.value)}
						/>

						<Transition
							as={Fragment}
							leave='transition ease-in duration-100'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<Combobox.Options className='absolute z-10 mt-1 flex max-h-60 w-full flex-col overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
								{suggestions.length === 0 && search !== '' ? (
									isSearching ? (
										<div className='relative cursor-default select-none px-4 py-2 text-gray-700'>
											{t('filters.loading')}.
										</div>
									) : (
										<button
											onClick={() => router.push(`/create-review`)}
											className='relative cursor-pointer select-none px-4 py-2 text-left text-gray-700 hover:bg-teal-100'
										>
											{t('filters.not-found')}
										</button>
									)
								) : (
									suggestions.map((landlord) => (
										<Combobox.Option
											key={landlord}
											className={({ active }) =>
												`cursor-pointer rounded-md p-2 text-left empty:invisible hover:bg-teal-100 ${
													active ? 'bg-teal-200' : ''
												}`
											}
											value={landlord}
										>
											{landlord}
										</Combobox.Option>
									))
								)}
							</Combobox.Options>
						</Transition>
					</div>
				</Combobox>
			</div>
		</div>
	)
}

export default Search
