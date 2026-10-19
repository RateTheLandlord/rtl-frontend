import Spinner from '@/components/ui/Spinner'
import { SuspiciousLandlord } from '@/util/interfaces/interfaces'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ModalShell from './ModalShell'

const RemoveSuspiciousLandlordModal = ({
	onClose,
	selectedSuspiciousLandlord,
}: {
	onClose: () => void
	selectedSuspiciousLandlord: SuspiciousLandlord
}) => {
	const [loading, setLoading] = useState(false)
	const onSubmitRemoveResource = () => {
		if (selectedSuspiciousLandlord) {
			setLoading(true)
			fetch('/api/suspicious-landlords/delete-suspicious-landlord', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: selectedSuspiciousLandlord.id }),
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
	}

	return (
		<ModalShell title='Remove Suspicious Landlord' onClose={onClose}>
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
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</>
		</ModalShell>
	)
}

export default RemoveSuspiciousLandlordModal
