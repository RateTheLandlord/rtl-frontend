import { ILocationHookResponse, Resource } from '@/util/interfaces/interfaces'
import { Dialog, Transition } from '@headlessui/react'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import TextInput from '../ui/TextInput'
import CityComboBox from '../create-review/components/CityComboBox'
import { useLocation } from '@/util/hooks/useLocation'
import StateSelector from '../ui/StateSelector'
import CountrySelector from '../ui/CountrySelector'
import LargeTextInput from '../ui/LargeTextInput'
import Spinner from '../ui/Spinner'
import { useAppDispatch } from '@/redux/hooks'
import { updateAlertOpen, updateAlertSuccess } from '@/redux/alert/alertSlice'

interface IProps {
	selectedResource: Resource | undefined
	handleMutate: () => void
	setEditResourceOpen: Dispatch<SetStateAction<boolean>>
	editResourceOpen: boolean
	setSelectedResource: Dispatch<SetStateAction<Resource | undefined>>
}

const EditResourceModal = ({
	selectedResource,
	handleMutate,
	setEditResourceOpen,
	editResourceOpen,
	setSelectedResource,
}: IProps) => {
	const dispatch = useAppDispatch()
	const [name, setName] = useState<string>(selectedResource?.name || '')
	const [country, setCountry] = useState<string>(
		selectedResource?.country_code || 'CA',
	)
	const [city, setCity] = useState<string>(selectedResource?.city || '')
	const [state, setState] = useState<string>(
		selectedResource?.state || 'Alberta',
	)
	const [address, setAddress] = useState(selectedResource?.address || '')
	const [phone, setPhone] = useState(selectedResource?.phone_number || '')
	const [description, setDescription] = useState(
		selectedResource?.description || '',
	)
	const [href, setHref] = useState(selectedResource?.href || '')

	const {
		searching,
		locations,
	}: { searching: boolean; locations: Array<ILocationHookResponse> } =
		useLocation(city, country)
	const [loading, setLoading] = useState(false)

	const onSubmitEditResource = () => {
		setLoading(true)
		const editedResource = {
			...selectedResource,
			name: name,
			country_code: country,
			city: city,
			state: state,
			address: address,
			phone_number: phone,
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
				handleMutate()
				setEditResourceOpen(false)
				dispatch(updateAlertSuccess(true))
				dispatch(updateAlertOpen(true))
				setSelectedResource(undefined)
			})
			.catch((err) => {
				console.log(err)
				dispatch(updateAlertSuccess(false))
				dispatch(updateAlertOpen(true))
				setSelectedResource(undefined)
			})
			.finally(() => setLoading(false))
	}

	return (
		<Transition.Root show={editResourceOpen} as={Fragment}>
			<Dialog as='div' className='relative z-50' onClose={setEditResourceOpen}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
								<div className='mt-1'>
									<TextInput
										title='Name'
										value={name ? name : selectedResource?.name}
										setValue={setName}
										id='name'
										placeHolder='Name'
									/>

									<TextInput
										title='Address'
										value={address ? address : selectedResource?.address}
										setValue={setAddress}
										id='address'
										placeHolder='Address '
									/>

									<TextInput
										title='Phone Number'
										value={phone ? phone : selectedResource?.phone_number}
										setValue={setPhone}
										id='phone'
										placeHolder='Phone Number'
									/>
									<TextInput
										title='Link'
										value={href ? href : selectedResource?.href}
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

									<StateSelector
										value={state}
										country={country ? country : selectedResource?.country_code}
										setValue={setState}
										noState={true}
									/>

									<CountrySelector setValue={setCountry} />

									<LargeTextInput
										title='Description'
										setValue={setDescription}
										id='description'
										value={
											description ? description : selectedResource?.description
										}
									/>
								</div>
								<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
									<button
										type='button'
										disabled={loading}
										className={`inline-flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
										onClick={() => onSubmitEditResource()}
									>
										{loading ? <Spinner /> : 'Submit'}
									</button>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm'
										onClick={() => {
											setSelectedResource(undefined)
											setEditResourceOpen(false)
										}}
									>
										Cancel
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default EditResourceModal
