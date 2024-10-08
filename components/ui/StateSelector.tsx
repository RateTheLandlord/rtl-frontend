import { useTranslation } from 'react-i18next'
import provinces from '@/util/countries/canada/provinces.json'
import regions from '@/util/countries/unitedKingdom/regions.json'
import states from '@/util/countries/unitedStates/states.json'
import territories from '@/util/countries/australia/territories.json'
import nz_provinces from '@/util/countries/newZealand/nz-provinces.json'
import de_states from '@/util/countries/germany/states.json'
import ie_counties from '@/util/countries/ireland/counties.json'
import no_counties from '@/util/countries/norway/counties.json'
import { Dispatch, Fragment, SetStateAction } from 'react'
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

interface IProps {
	country: string | undefined
	value: string
	setValue: Dispatch<SetStateAction<string>>
	noState?: boolean
}

const StateSelector = ({ country, value, setValue, noState }: IProps) => {
	const { t } = useTranslation('create')
	return (
		<div data-testid='state-selector' className='sm:col-span-1'>
			<Listbox value={value} onChange={setValue}>
				<div className='relative mt-1'>
					<label htmlFor='city' className='block text-sm  text-gray-700'>
						{country === 'GB'
							? t('create-review.review-form.region')
							: country === 'IE'
							? t('create-review.review-form.county')
							: t('create-review.review-form.state')}
					</label>
					<ListboxButton className='relative flex w-full cursor-default items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
						{value}
						<ChevronDownIcon className='h-4 w-4' />
					</ListboxButton>
				</div>
				<Transition
					as={Fragment}
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<ListboxOptions
						anchor='bottom start'
						className='mt-1 max-h-[250px] w-[250px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
					>
						{country === 'CA'
							? provinces.map((province) => {
									return (
										<ListboxOption
											className='cursor-pointer p-2 hover:bg-teal-300'
											key={province.short}
											value={province.name}
										>
											{province.name}
										</ListboxOption>
									)
							  })
							: country === 'GB'
							? regions.map((region) => {
									return (
										<ListboxOption
											className='cursor-pointer p-2 hover:bg-teal-300'
											key={region.short}
											value={region.name}
										>
											{region.name}
										</ListboxOption>
									)
							  })
							: country === 'AU'
							? territories.map((territory) => {
									return (
										<ListboxOption
											className='cursor-pointer p-2 hover:bg-teal-300'
											key={territory.short}
											value={territory.name}
										>
											{territory.name}
										</ListboxOption>
									)
							  })
							: country === 'NZ'
							? nz_provinces.map((prov) => {
									return (
										<ListboxOption
											className='cursor-pointer p-2 hover:bg-teal-300'
											key={prov.short}
											value={prov.name}
										>
											{prov.name}
										</ListboxOption>
									)
							  })
							: country === 'DE'
							? de_states.map((state) => {
									return (
										<ListboxOption
											className='cursor-pointer p-2 hover:bg-teal-300'
											key={state.short}
											value={state.name}
										>
											{state.name}
										</ListboxOption>
									)
							  })
							: country === 'IE'
							? ie_counties.map((county) => {
									return (
										<ListboxOption
											className='cursor-pointer p-2 hover:bg-teal-300'
											key={county.short}
											value={county.name}
										>
											{county.name}
										</ListboxOption>
									)
							  })
							: country === 'NO'
							? no_counties.map((county) => {
									return (
										<ListboxOption
											className='cursor-pointer p-2 hover:bg-teal-300'
											key={county.short}
											value={county.name}
										>
											{county.name}
										</ListboxOption>
									)
							  })
							: states.map((state) => {
									return (
										<ListboxOption
											className='cursor-pointer p-2 hover:bg-teal-300'
											key={state.short}
											value={state.name}
										>
											{state.name}
										</ListboxOption>
									)
							  })}
						{noState && (
							<ListboxOption
								className='cursor-pointer p-2 hover:bg-teal-300'
								value='NO STATE / PROVINCE'
							>
								No State / Province
							</ListboxOption>
						)}
					</ListboxOptions>
				</Transition>
			</Listbox>
		</div>
	)
}

export default StateSelector
