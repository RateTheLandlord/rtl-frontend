import { Fragment, useEffect, useState } from 'react'
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
	resetResource,
	updateAddress,
	updateDescription,
	updateHref,
	updateName,
	updatePhone,
	updateState,
} from '@/redux/resource/resourceSlice'
import {
	CloseButton,
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { updateAddResourceOpen } from '@/redux/modal/modalSlice'
import ButtonLight from '../ui/button-light'
import Button from '../ui/button'
import Spinner from '../ui/Spinner'
import { toast } from 'react-toastify'

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
	const { addResourceOpen } = useAppSelector((state) => state.modal)
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
		<Transition.Root show={addResourceOpen} as={Fragment} data-testid='modal-1'>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={() => dispatch(updateAddResourceOpen(false))}
			>
				<TransitionChild
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity' />
				</TransitionChild>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<DialogPanel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
								<CloseButton
									onClick={() => dispatch(updateAddResourceOpen(false))}
								/>
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
										<Dialog.Title
											as='h3'
											className='text-lg leading-6 text-gray-900'
										>
											Add Resource
										</Dialog.Title>
									</div>
								</div>
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
													setValue={(str: string) =>
														dispatch(updateDescription(str))
													}
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
										<Button
											disabled={loading}
											onClick={() => onSubmitNewResource()}
										>
											Submit
										</Button>
									)}
									<ButtonLight
										onClick={() => dispatch(updateAddResourceOpen(false))}
									>
										Cancel
									</ButtonLight>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default AddResourceModal
