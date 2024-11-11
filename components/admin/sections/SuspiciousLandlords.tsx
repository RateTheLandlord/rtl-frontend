import { Fragment, useState } from 'react'
import {
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	Transition,
} from '@headlessui/react'
import { classNames } from '@/util/helpers/helper-functions'
import { MenuAlt3Icon } from '@heroicons/react/solid'
import Button from '@/components/ui/button'
import useSWR from 'swr'
import { fetchWithBody } from '@/util/helpers/fetcher'
import Spinner from '@/components/ui/Spinner'
import {
	SuspiciousLandlord,
	SuspiciousLandlordResponse,
} from '@/util/interfaces/interfaces'
import Modal from '@/components/modal/Modal'
import { toast } from 'react-toastify'
import AddSuspiciousLandlordModal from '../components/AddSuspiciousLandlordModal'
import EditSuspiciousLandlordModal from '../components/EditSuspiciousLandlordModal'
import RemoveSuspiciousLandlord from '../components/RemoveSuspiciousLandlordModal'

const SuspiciousLandlords = () => {
	const { data, error, mutate } = useSWR<SuspiciousLandlordResponse>(
		['/api/suspicious-landlords/get-landlords', { limit: '1000' }],
		fetchWithBody,
	)

	const [loading, setLoading] = useState(false)
	const [landlord, setLandlord] = useState('')
	const [message, setMessage] = useState('')

	const [selectedSuspiciousLandlord, setSelectedSuspiciousLandlord] = useState<
		SuspiciousLandlord | undefined
	>()

	const [addSuspiciousLandlordOpen, setAddSuspiciousLandlordOpen] =
		useState(false)
	const [editSuspiciousLandlordOpen, setEditSuspiciousLandlordOpen] =
		useState(false)
	const [removeSuspiciousLandlordOpen, setRemoveSuspiciousLandlordOpen] =
		useState(false)
	if (error) return <div>failed to load...</div>
	if (!data) return <Spinner />

	const resetForm = () => {
		setLandlord('')
		setMessage('')
	}

	const onSubmitNewLandlord = () => {
		setLoading(true)
		const newLandlord = {
			landlord: landlord,
			message: message,
		}

		fetch('/api/suspicious-landlords/add-suspicious-landlord', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newLandlord),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				}
			})
			.then(() => {
				mutate()
				setAddSuspiciousLandlordOpen(false)
				toast.success('Success!')
				resetForm()
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
			})
			.finally(() => setLoading(false))
	}

	const handleMutate = () => {
		mutate()
	}
	return (
		<div className='container flex w-full flex-col justify-center'>
			{editSuspiciousLandlordOpen && (
				<EditSuspiciousLandlordModal
					selectedSuspiciousLandlord={selectedSuspiciousLandlord}
					handleMutate={handleMutate}
					setEditSuspiciousLandlordOpen={setEditSuspiciousLandlordOpen}
					setSelectedSuspiciousLandlord={setSelectedSuspiciousLandlord}
					editSuspiciousLandlordOpen={editSuspiciousLandlordOpen}
				/>
			)}
			{removeSuspiciousLandlordOpen && (
				<RemoveSuspiciousLandlord
					selectedLandlord={selectedSuspiciousLandlord}
					handleMutate={handleMutate}
					setRemoveSuspiciousLandlordOpen={setRemoveSuspiciousLandlordOpen}
					removeSuspiciousLandlordOpen={removeSuspiciousLandlordOpen}
					setSelectedSuspiciousLandlord={setSelectedSuspiciousLandlord}
				/>
			)}
			{addSuspiciousLandlordOpen && (
				<Modal
					loading={loading}
					title='Add Suspicious Landlord'
					open={addSuspiciousLandlordOpen}
					setOpen={setAddSuspiciousLandlordOpen}
					element={
						<AddSuspiciousLandlordModal
							landlord={landlord}
							setLandlord={setLandlord}
							message={message}
							setMessage={setMessage}
						/>
					}
					onSubmit={onSubmitNewLandlord}
					buttonColour='blue'
					selectedId={1}
				/>
			)}
			<div className='flex w-full justify-end'>
				<Button onClick={() => setAddSuspiciousLandlordOpen(true)}>
					Add New Landlord
				</Button>
			</div>
			{data.landlords.length && (
				<ul
					role='list'
					className='mt-2 divide-y divide-gray-100 border-t border-gray-100'
				>
					{data.landlords.map((landlord) => (
						<li
							key={landlord.id}
							className='flex items-center justify-between gap-x-6 py-3'
						>
							<div className='min-w-0'>
								<div className='flex items-center justify-start gap-x-3'>
									<p className='text-sm  leading-6 text-gray-900'>
										{landlord.landlord}
									</p>
								</div>
								<div className='mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500'>
									<p className='truncate'>{landlord.message}</p>
								</div>
							</div>
							<div className='flex flex-none items-center gap-x-4'>
								<Menu as='div' className='relative flex-none'>
									<MenuButton className='-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900'>
										<span className='sr-only'>Open options</span>
										<MenuAlt3Icon className='h-5 w-5' aria-hidden='true' />
									</MenuButton>
									<Transition
										as={Fragment}
										enter='transition ease-out duration-100'
										enterFrom='transform opacity-0 scale-95'
										enterTo='transform opacity-100 scale-100'
										leave='transition ease-in duration-75'
										leaveFrom='transform opacity-100 scale-100'
										leaveTo='transform opacity-0 scale-95'
									>
										<MenuItems className='absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
											<MenuItem>
												{({ active }) => (
													<button
														onClick={() => {
															setEditSuspiciousLandlordOpen(true)
															setSelectedSuspiciousLandlord(landlord)
														}}
														className={classNames(
															active ? 'bg-gray-50' : '',
															'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900',
														)}
													>
														Edit
														<span className='sr-only'>
															, {landlord.landlord}
														</span>
													</button>
												)}
											</MenuItem>

											<MenuItem>
												{({ active }) => (
													<button
														onClick={() => {
															setRemoveSuspiciousLandlordOpen(true)
															setSelectedSuspiciousLandlord(landlord)
														}}
														className={classNames(
															active ? 'bg-gray-50' : '',
															'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900',
														)}
													>
														Delete
														<span className='sr-only'>{landlord.landlord}</span>
													</button>
												)}
											</MenuItem>
										</MenuItems>
									</Transition>
								</Menu>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default SuspiciousLandlords
