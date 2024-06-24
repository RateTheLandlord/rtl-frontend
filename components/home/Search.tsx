import { useAppDispatch } from '@/redux/hooks'
import { updateSearch } from '@/redux/query/querySlice'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'
import { Combobox, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'

const Search = () => {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const [search, setSearch] = useState('')

	const comboInputClassName = `block w-full rounded-l-md border-0 px-4 py-3 text-base text-gray-900 placeholder-gray-500`

	const {
		isSearching,
		landlordSuggestions: suggestions,
	}: { isSearching: boolean; landlordSuggestions: Array<string> } =
		useLandlordSuggestions(search)

	const submitCombo = (e) => {
		dispatch(updateSearch(e))
		router.push('/reviews')
	}
	return (
		<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			<div className='rounded-3xl bg-gray-50 px-6 py-16 sm:p-16'>
				<div className='sm:flex'>
					<Combobox value={search} onChange={submitCombo}>
						<div
							data-testid='create-review-form-landlord-1'
							className='relative w-full pt-2 lg:pt-0'
						>
							<label
								htmlFor='landlord'
								className='sr-only block text-sm text-gray-700'
							>
								Landlord Search
							</label>
							<Combobox.Input
								className={comboInputClassName}
								placeholder='Search for your Landlord'
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
									{search.length > 0 && (
										<Combobox.Option
											value={search}
											className={({ active }) =>
												`cursor-pointer rounded-md p-2 text-left empty:invisible hover:bg-teal-100 ${
													active ? 'bg-teal-200' : ''
												}`
											}
										>
											Search for <span>"{search}"</span>
										</Combobox.Option>
									)}
									{suggestions.length === 0 && search !== '' ? (
										isSearching ? (
											<div className='relative cursor-default select-none px-4 py-2 text-gray-700'>
												Loading...
											</div>
										) : null
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
					<div className='mt-3 sm:mt-0'>
						<button
							type='submit'
							className='block w-full rounded-r-md bg-teal-500 px-4 py-3 font-medium text-white shadow hover:bg-indigo-600 focus:outline-none'
						>
							Search
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Search
