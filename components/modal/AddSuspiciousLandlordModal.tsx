import LargeTextInput from '@/components/ui/LargeTextInput'
import Spinner from '@/components/ui/Spinner'
import TextInput from '@/components/ui/TextInput'
import Button from '@/components/ui/button'
import ButtonLight from '@/components/ui/button-light'
import { useAppDispatch } from '@/redux/hooks'
import { updateAddSuspiciousLandlordOpen } from '@/redux/modal/modalSlice'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ModalShell from './ModalShell'

const AddSuspiciousLandlordModal = () => {
	const dispatch = useAppDispatch()
	const [loading, setLoading] = useState(false)
	const [landlord, setLandlord] = useState('')
	const [message, setMessage] = useState('')

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
				dispatch(updateAddSuspiciousLandlordOpen(false))
				toast.success('Success!')
				resetForm()
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
			})
			.finally(() => setLoading(false))
	}
	return (
		<ModalShell
			title='Add Suspicious Landlord'
			onClose={() => dispatch(updateAddSuspiciousLandlordOpen(false))}
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
									title='Landlord'
									value={landlord}
									setValue={setLandlord}
									id='landlord'
									placeHolder='Landlord'
								/>

								<LargeTextInput
									title='Message'
									setValue={setMessage}
									value={message}
									id='message'
								/>
							</div>
						</div>
					</div>
				</form>
				<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
					{loading ? (
						<Spinner />
					) : (
						<Button disabled={loading} onClick={() => onSubmitNewLandlord()}>
							Submit
						</Button>
					)}
					<ButtonLight
						onClick={() => dispatch(updateAddSuspiciousLandlordOpen(false))}
					>
						Cancel
					</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default AddSuspiciousLandlordModal
