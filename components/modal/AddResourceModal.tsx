import CityComboBox from '@/components/create-review/components/CityComboBox'
import CountrySelector from '@/components/ui/CountrySelector'
import LargeTextInput from '@/components/ui/LargeTextInput'
import StateSelector from '@/components/ui/StateSelector'
import TextInput from '@/components/ui/TextInput'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateAddResourceOpen } from '@/redux/modal/modalSlice'
import {
	resetResource,
	updateAddress,
	updateDescription,
	updateHref,
	updateName,
	updatePhone,
	updateState,
} from '@/redux/resource/resourceSlice'
import { Country } from '@/types/review.types'
import { useLocation } from '@/util/hooks/useLocation'
import { ILocationHookResponse } from '@/util/interfaces/interfaces'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import Spinner from '../ui/Spinner'
import ModalShell from './ModalShell'

const AddResourceModal = () => {
	const {
		name,
		country_code,
		city,
		state,
		address,
		phone_number,
		description,
		href,
	} = useAppSelector((state) => state.resource)
	const dispatch = useAppDispatch()
	const {
		searching,
		locations,
	}: { searching: boolean; locations: ILocationHookResponse[] } = useLocation(
		city,
		country_code,
	)

	const [loading, setLoading] = useState(false)

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

	const onSubmitNewResource = () => {
		setLoading(true)
		const newResource = {
			name: name,
			country_code,
			city: city,
			state: state,
			address: address,
			phone_number,
			description: description,
			href: href,
		}

		fetch('/api/tenant-resources/add-resource', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newResource),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				}
			})
			.then(() => {
				dispatch(updateAddResourceOpen(false))
				toast.success('Success!')
				dispatch(resetResource())
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
			})
			.finally(() => setLoading(false))
	}
	return (
		<ModalShell
			title='Add Resource'
			onClose={() => dispatch(updateAddResourceOpen(false))}
		>
			<>
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
				<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
					{loading ? (
						<Spinner />
					) : (
						<Button disabled={loading} onClick={() => onSubmitNewResource()}>
							Submit
						</Button>
					)}
					<ButtonLight onClick={() => dispatch(updateAddResourceOpen(false))}>
						Cancel
					</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default AddResourceModal
