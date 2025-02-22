import { useAppDispatch } from '@/redux/hooks'
import { updateSearch } from '@/redux/query/querySlice'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'
import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Transition,
} from '@headlessui/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'

const Search = () => {
	const t = useTranslations('filters')
	const dispatch = useAppDispatch()
	const router = useRouter()
	const [search, setSearch] = useState('')

	const {
		isSearching,
		landlordSuggestions: suggestions,
	}: { isSearching: boolean; landlordSuggestions: string[] } =
		useLandlordSuggestions(search)

	const submitCombo = (e) => {
		if (e) {
			dispatch(updateSearch(e))
			router.push(`/landlord/${encodeURIComponent(e)}`)
		}
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
							{`${t('search')} ${t('landlord')}`}
						</label>
						<ComboboxInput
							className='block w-full rounded-md border-0 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-500'
							placeholder={t('search-placeholder')}
							displayValue={(state: string) => state}
							onChange={(event) => setSearch(event.target.value)}
						/>

						<Transition
							as={Fragment}
							leave='transition ease-in duration-100'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<ComboboxOptions className='ring-opacity-5 absolute z-10 mt-1 flex max-h-60 w-full flex-col overflow-auto rounded-md bg-white text-base ring-1 shadow-lg ring-black focus:outline-none sm:text-sm'>
								{suggestions.length === 0 && search !== '' ? (
									isSearching ? (
										<div className='relative cursor-default px-4 py-2 text-gray-700 select-none'>
											{t('loading')}.
										</div>
									) : (
										<button
											onClick={() => router.push(`/create-review`)}
											className='relative cursor-pointer px-4 py-2 text-left text-gray-700 select-none hover:bg-teal-100'
										>
											{t('not-found')}
										</button>
									)
								) : (
									suggestions.map((landlord) => (
										<ComboboxOption
											key={landlord}
											className={({ active }) =>
												`cursor-pointer rounded-md p-2 text-left empty:invisible hover:bg-teal-100 ${
													active ? 'bg-teal-200' : ''
												}`
											}
											value={landlord}
										>
											{landlord}
										</ComboboxOption>
									))
								)}
							</ComboboxOptions>
						</Transition>
					</div>
				</Combobox>
			</div>
		</div>
	)
}

export default Search
