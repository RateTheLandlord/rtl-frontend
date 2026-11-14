import { Resource } from '@/util/interfaces/interfaces'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../ui/Spinner'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import ModalShell from './ModalShell'

const RemoveResourceModal = ({
	onClose,
	selectedResource,
}: {
	onClose: () => void
	selectedResource: Resource
}) => {
	const [loading, setLoading] = useState(false)
	const onSubmitRemoveResource = () => {
		if (selectedResource) {
			setLoading(true)
			fetch('/api/tenant-resources/delete-resource', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: selectedResource.id }),
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
		<ModalShell title='Remove Resource' onClose={onClose}>
			<>
				<div>
					<div className='ml-4' data-testid='remove-review-modal-1'>
						<h2>
							Are you sure you want to remove this resource? This cannot be
							undone.
						</h2>
					</div>
				</div>
				<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
					{loading ? (
						<Spinner />
					) : (
						<Button onClick={() => onSubmitRemoveResource()}>Remove</Button>
					)}

					<ButtonLight onClick={onClose}>Cancel</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default RemoveResourceModal
