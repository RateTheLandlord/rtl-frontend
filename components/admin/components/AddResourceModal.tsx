import { Dispatch, SetStateAction, useEffect } from 'react'
import CityComboBox from '@/components/create-review/components/CityComboBox'
import { useLocation } from '@/util/hooks/useLocation'
import { ILocationHookResponse } from '@/util/interfaces/interfaces'
import TextInput from '@/components/ui/TextInput'
import LargeTextInput from '@/components/ui/LargeTextInput'
import CountrySelector from '@/components/ui/CountrySelector'
import StateSelector from '@/components/ui/StateSelector'

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
						<TextInput
							title='Name'
							value={name}
							setValue={setName}
							id='name'
							placeHolder='Name'
						/>

						<TextInput
							title='Address'
							value={address}
							setValue={setAddress}
							id='address'
							placeHolder='Address '
						/>

						<TextInput
							title='Phone Number'
							value={phone}
							setValue={setPhone}
							id='phone'
							placeHolder='Phone Number'
						/>
						<TextInput
							title='Link'
							value={href}
							setValue={setHref}
							id='href'
							placeHolder='Link'
						/>

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

						<StateSelector country={country} setValue={setState} />

						<CountrySelector setValue={setCountry} />

						<LargeTextInput
							title='Description'
							setValue={setDescription}
							id='description'
						/>
					</div>
				</div>
			</div>
		</form>
	)
}

export default AddResourceModal
