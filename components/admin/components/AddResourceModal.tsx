import { country_codes } from '@/util/helpers/getCountryCodes'
import { Dispatch, SetStateAction, useEffect } from 'react'
import countries from '@/util/countries/countries.json'
import CityComboBox from '@/components/create-review/components/CityComboBox'
import { useLocation } from '@/util/hooks/useLocation'
import { ILocationHookResponse } from '@/util/interfaces/interfaces'
import provinces from '@/util/countries/canada/provinces.json'
import regions from '@/util/countries/unitedKingdom/regions.json'
import states from '@/util/countries/unitedStates/states.json'
import territories from '@/util/countries/australia/territories.json'
import nz_provinces from '@/util/countries/newZealand/nz-provinces.json'

interface IProps {
	name: string
	setName: Dispatch<SetStateAction<string>>
	country: string
	setCountry: Dispatch<SetStateAction<string>>
	city: string
	setCity: Dispatch<SetStateAction<string>>
	setState: Dispatch<SetStateAction<string>>
	address: string
	setAddress: Dispatch<SetStateAction<string>>
	phone: string
	setPhone: Dispatch<SetStateAction<string>>
	setDescription: Dispatch<SetStateAction<string>>
	href: string
	setHref: Dispatch<SetStateAction<string>>
}

const AddResourceModal = ({
	name,
	setName,
	country,
	setCountry,
	city,
	setCity,
	setState,
	address,
	setAddress,
	phone,
	setPhone,
	setDescription,
	href,
	setHref,
}: IProps) => {
	const {
		searching,
		locations,
	}: { searching: boolean; locations: Array<ILocationHookResponse> } =
		useLocation(city, country)

	useEffect(() => {
		if (country === 'GB') {
			setState('England')
		} else if (country === 'AU') {
			setState('Northern Territory')
		} else if (country === 'US') {
			setState('Alabama')
		} else if (country === 'NZ') {
			setState('Marlborough')
		} else {
			setState('Alberta')
		}
	}, [country])
	return (
		<form
			className='container w-full space-y-8 divide-y divide-gray-200'
			data-testid='add-user-modal-1'
		>
			<div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
				<div className='space-y-6 pt-8 sm:space-y-5 sm:pt-10'>
					<div className='space-y-6 sm:space-y-5'>
						<div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5'>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
							>
								Name
							</label>
							<div className='mt-1 sm:col-span-2 sm:mt-0'>
								<input
									onChange={(e) => setName(e.target.value)}
									type='text'
									name='name'
									id='name'
									value={name}
									placeholder='Name'
									className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
								/>
							</div>
						</div>

						<div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5'>
							<label
								htmlFor='address'
								className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
							>
								Address
							</label>
							<div className='mt-1 sm:col-span-2 sm:mt-0'>
								<input
									onChange={(e) => setAddress(e.target.value)}
									type='text'
									name='address'
									id='address'
									value={address}
									placeholder='Address'
									className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
								/>
							</div>
						</div>
						<div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5'>
							<label
								htmlFor='phone'
								className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
							>
								Phone Number
							</label>
							<div className='mt-1 sm:col-span-2 sm:mt-0'>
								<input
									onChange={(e) => setPhone(e.target.value)}
									type='text'
									name='phone'
									id='phone'
									value={phone}
									placeholder='Phone Number'
									className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
								/>
							</div>
						</div>
						<div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5'>
							<label
								htmlFor='href'
								className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
							>
								Link
							</label>
							<div className='mt-1 sm:col-span-2 sm:mt-0'>
								<input
									onChange={(e) => setHref(e.target.value)}
									type='text'
									name='href'
									id='href'
									value={href}
									placeholder='Link'
									className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
								/>
							</div>
						</div>
						<div className='sm:col-span-3'>
							<label
								htmlFor='country'
								className='block text-sm font-medium text-gray-700'
							>
								Country
							</label>
							<div className='mt-1'>
								<select
									id='country'
									name='country'
									required
									onChange={(e) => setCountry(e.target.value)}
									className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								>
									{country_codes.map((country) => {
										if (country === 'CA') {
											return (
												<option key={country} value={country} selected>
													{countries[country]}
												</option>
											)
										} else {
											return (
												<option key={country} value={country}>
													{countries[country]}
												</option>
											)
										}
									})}
								</select>
							</div>
						</div>
						<div className='sm:col-span-2'>
							<CityComboBox
								name='City'
								state={city}
								setState={setCity}
								options={locations}
								searching={searching}
								error={false}
								errorText={'text'}
							/>
						</div>

						<div className='sm:col-span-2'>
							<label
								htmlFor='region'
								className='block text-sm font-medium text-gray-700'
							>
								{country === 'GB' ? 'Region' : 'State / Province'}
							</label>
							<div className='mt-1'>
								<select
									id='region'
									name='region'
									required
									onChange={(e) => setState(e.target.value)}
									className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								>
									{country === 'CA'
										? provinces.map((province) => {
												return (
													<option key={province.short} value={province.name}>
														{province.name}
													</option>
												)
										  })
										: country === 'GB'
										? regions.map((region) => {
												return (
													<option key={region.short} value={region.name}>
														{region.name}
													</option>
												)
										  })
										: country === 'AU'
										? territories.map((territory) => {
												return (
													<option key={territory.short} value={territory.name}>
														{territory.name}
													</option>
												)
										  })
										: country === 'NZ'
										? nz_provinces.map((prov) => {
												return (
													<option key={prov.short} value={prov.name}>
														{prov.name}
													</option>
												)
										  })
										: states.map((state) => {
												return (
													<option key={state.short} value={state.name}>
														{state.name}
													</option>
												)
										  })}
								</select>
							</div>
						</div>
						<div>
							<label
								htmlFor='comment'
								className='mt-2 block text-sm font-medium text-gray-700'
							>
								Review
							</label>
							<div className='mt-1'>
								<textarea
									rows={4}
									name='comment'
									id='comment'
									onChange={(e) => setDescription(e.target.value)}
									className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									defaultValue={''}
									data-testid='create-review-form-text-1'
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	)
}

export default AddResourceModal
