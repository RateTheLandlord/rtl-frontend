import { useEffect } from 'react'
import CityComboBox from '@/components/create-review/components/CityComboBox'
import { useLocation } from '@/util/hooks/useLocation'
import { ILocationHookResponse } from '@/util/interfaces/interfaces'
import TextInput from '@/components/ui/TextInput'
import LargeTextInput from '@/components/ui/LargeTextInput'
import CountrySelector from '@/components/ui/CountrySelector'
import StateSelector from '@/components/ui/StateSelector'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Country } from '@/types/review.types'
import {
	updateAddress,
	updateDescription,
	updateHref,
	updateName,
	updatePhone,
	updateState,
} from '@/redux/resource/resourceSlice'

const AddResourceModal = () => {
	const { name, country_code, city, address, phone_number, description, href } =
		useAppSelector((state) => state.resource)
	const dispatch = useAppDispatch()
	const {
		searching,
		locations,
	}: { searching: boolean; locations: ILocationHookResponse[] } = useLocation(
		city,
		country_code,
	)

	useEffect(() => {
		if (country_code === Country.GB) {
			dispatch(updateState('England'))
		} else if (country_code === Country.AU) {
			dispatch(updateState('Northern Territory'))
		} else if (country_code === Country.US) {
			dispatch(updateState('Alabama'))
		} else if (country_code === Country.IE) {
			dispatch(updateState('Dublin'))
		} else if (country_code === Country.NO) {
			dispatch(updateState('Norway'))
		} else if (country_code === Country.NZ) {
			dispatch(updateState('Auckland'))
		} else {
			dispatch(updateState('Alberta'))
		}
	}, [country_code, dispatch])
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
							setValue={(str) => dispatch(updateName(str))}
							id='name'
							placeHolder='Name'
						/>

						<TextInput
							title='Address'
							value={address}
							setValue={(str) => dispatch(updateAddress(str))}
							id='address'
							placeHolder='Address '
						/>

						<TextInput
							title='Phone Number'
							value={phone_number}
							setValue={(str) => dispatch(updatePhone(str))}
							id='phone'
							placeHolder='Phone Number'
						/>
						<TextInput
							title='Link'
							value={href}
							setValue={(str) => dispatch(updateHref(str))}
							id='href'
							placeHolder='Link'
						/>

						<div className='sm:col-span-2'>
							<CityComboBox
								name='City'
								isResource
								options={locations}
								searching={searching}
								error={false}
								errorText={'text'}
							/>
						</div>

						<StateSelector isResource noState={true} />

						<CountrySelector isResource />

						<LargeTextInput
							title='Description'
							setValue={(str: string) => dispatch(updateDescription(str))}
							value={description}
							id='description'
						/>
					</div>
				</div>
			</div>
		</form>
	)
}

export default AddResourceModal
