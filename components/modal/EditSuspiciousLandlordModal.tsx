import LargeTextInput from '@/components/ui/LargeTextInput'
import Spinner from '@/components/ui/Spinner'
import TextInput from '@/components/ui/TextInput'
import { SuspiciousLandlord } from '@/util/interfaces/interfaces'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ModalShell from './ModalShell'

const EditSuspiciousLandlordModal = ({
	onClose,
	selectedSuspiciousLandlord,
}: {
	onClose: () => void
	selectedSuspiciousLandlord: SuspiciousLandlord
}) => {
	const [loading, setLoading] = useState(false)
	const [landlord, setLandlord] = useState<string>(
		selectedSuspiciousLandlord?.landlord || '',
	)
	const [message, setMessage] = useState<string>(
		selectedSuspiciousLandlord?.message || '',
	)

	const onSubmitEditResource = () => {
		setLoading(true)
		const editedResource = {
			...selectedSuspiciousLandlord,
			landlord: landlord,
			message: message,
		}
		fetch('/api/suspicious-landlords/edit-suspicious-landlord', {
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
				toast.success('Success!')
				onClose()
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
				onClose()
			})
			.finally(() => setLoading(false))
	}

	return (
		<ModalShell title='Edit Suspicious Landlord' onClose={onClose}>
			<>
				<div className='mt-1'>
					<TextInput
						title='Landlord'
						value={landlord ? landlord : selectedSuspiciousLandlord?.landlord}
						setValue={setLandlord}
						id='landlord'
						placeHolder='Landlord'
					/>

					<LargeTextInput
						title='Message'
						setValue={setMessage}
						id='message'
						value={message ? message : selectedSuspiciousLandlord?.message}
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
							onClose()
						}}
					>
						Cancel
					</button>
				</div>
			</>
		</ModalShell>
	)
}

export default EditSuspiciousLandlordModal
