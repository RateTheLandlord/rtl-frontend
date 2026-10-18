import Spinner from '@/components/ui/Spinner'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateRemoveSuspiciousLandlordOpen,
	updateSelectedSuspiciousLandlord,
} from '@/redux/modal/modalSlice'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ModalShell from './ModalShell'

const RemoveSuspiciousLandlordModal = () => {
	const { selectedSuspiciousLandlord: selectedLandlord } = useAppSelector(
		(state) => state.modal,
	)
	const dispatch = useAppDispatch()
	const [loading, setLoading] = useState(false)
	const onSubmitRemoveResource = () => {
		if (selectedLandlord) {
			setLoading(true)
			fetch('/api/suspicious-landlords/delete-suspicious-landlord', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: selectedLandlord.id }),
			})
				.then((result) => {
					if (!result.ok) {
						throw new Error()
					}
				})
				.then(() => {
					toast.success('Success!')
					dispatch(updateRemoveSuspiciousLandlordOpen(false))
					dispatch(updateSelectedSuspiciousLandlord(undefined))
				})
				.catch((err) => {
					console.log(err)
					toast.error('Failure: Something went wrong, please try again.')
					dispatch(updateSelectedSuspiciousLandlord(undefined))
				})
				.finally(() => setLoading(false))
		}
	}

	return (
		<ModalShell
			title='Remove Suspicious Landlord'
			onClose={() => dispatch(updateRemoveSuspiciousLandlordOpen(false))}
		>
			<>
				<div>
					<div className='ml-4' data-testid='remove-review-modal-1'>
						<h2>
							Are you sure you want to remove this landlord&apos;s message? This
							cannot be undone.
						</h2>
					</div>
				</div>
				<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
					<button
						type='button'
						disabled={loading}
						className={`hover:bg-red:700 inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base text-white shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
						onClick={() => onSubmitRemoveResource()}
					>
						{loading ? <Spinner /> : 'Remove'}
					</button>
					<button
						type='button'
						className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 shadow-sm hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm'
						onClick={() => {
							dispatch(updateRemoveSuspiciousLandlordOpen(false))
							dispatch(updateSelectedSuspiciousLandlord(undefined))
						}}
					>
						Cancel
					</button>
				</div>
			</>
		</ModalShell>
	)
}

export default RemoveSuspiciousLandlordModal
