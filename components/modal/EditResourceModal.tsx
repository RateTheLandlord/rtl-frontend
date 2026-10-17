import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateEditResourceOpen,
	updateSelectedResource,
} from '@/redux/modal/modalSlice'
import {
	updateAddress,
	updateCity,
	updateDescription,
	updateHref,
	updateName,
	updatePhone,
	updateResource,
} from '@/redux/resource/resourceSlice'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CountrySelector from '../ui/CountrySelector'
import LargeTextInput from '../ui/LargeTextInput'
import Spinner from '../ui/Spinner'
import StateSelector from '../ui/StateSelector'
import TextInput from '../ui/TextInput'
import ModalShell from './ModalShell'

const EditResourceModal = () => {
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
	const { selectedResource } = useAppSelector((state) => state.modal)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (selectedResource) {
			dispatch(updateResource(selectedResource))
		}
	}, [selectedResource])

	const [loading, setLoading] = useState(false)

	const onSubmitEditResource = () => {
		setLoading(true)
		const editedResource = {
			...selectedResource,
			name: name,
			country_code,
			city: city,
			state: state,
			address: address,
			phone_number,
			description: description,
			href: href,
		}
		fetch('/api/tenant-resources/edit-resource', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(editedResource),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				}
			})
			.then(() => {
				dispatch(updateEditResourceOpen(false))
				dispatch(updateSelectedResource(undefined))
				toast.success('Success!')
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
				dispatch(updateEditResourceOpen(false))
				dispatch(updateSelectedResource(undefined))
			})
			.finally(() => setLoading(false))
	}

	return (
		<ModalShell
			title='Edit Resource'
			onClose={() => dispatch(updateEditResourceOpen(false))}
		>
			<>
				<div className='mt-1'>
					<TextInput
						title='Name'
						value={name ? name : selectedResource?.name}
						setValue={(str: string) => dispatch(updateName(str))}
						id='name'
						placeHolder='Name'
					/>

					<TextInput
						title='Address'
						value={address ? address : selectedResource?.address}
						setValue={(str: string) => dispatch(updateAddress(str))}
						id='address'
						placeHolder='Address '
					/>

					<TextInput
						title='Phone Number'
						value={phone_number ? phone_number : selectedResource?.phone_number}
						setValue={(str: string) => dispatch(updatePhone(str))}
						id='phone'
						placeHolder='Phone Number'
					/>
					<TextInput
						title='Link'
						value={href ? href : selectedResource?.href}
						setValue={(str: string) => dispatch(updateHref(str))}
						id='href'
						placeHolder='Link'
					/>

					<div className='sm:col-span-2'>
						<label htmlFor='city' className='block text-sm text-gray-700'>
							City
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='city'
								id='city'
								placeholder='City'
								value={city ? city : selectedResource?.city}
								required
								onChange={(e) => dispatch(updateCity(e.target.value))}
								className='block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								data-testid='create-review-form-city-1'
							/>
						</div>
					</div>

					<StateSelector isResource noState={true} />

					<CountrySelector isResource />

					<LargeTextInput
						title='Description'
						setValue={(str: string) => dispatch(updateDescription(str))}
						id='description'
						value={description ? description : selectedResource?.description}
					/>
				</div>
				<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
					<button
						type='button'
						disabled={loading}
						className={`inline-flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
						onClick={() => onSubmitEditResource()}
					>
						{loading ? <Spinner /> : 'Submit'}
					</button>
					<button
						type='button'
						className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 shadow-sm hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm'
						onClick={() => {
							dispatch(updateEditResourceOpen(false))
							dispatch(updateSelectedResource(undefined))
						}}
					>
						Cancel
					</button>
				</div>
			</>
		</ModalShell>
	)
}

export default EditResourceModal
