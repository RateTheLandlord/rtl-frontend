import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateRemoveResourceOpen,
	updateSelectedResource,
} from '@/redux/modal/modalSlice'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../ui/Spinner'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'
import ModalShell from './ModalShell'

const RemoveResourceModal = () => {
	const { selectedResource } = useAppSelector((state) => state.modal)
	const dispatch = useAppDispatch()
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
					dispatch(updateRemoveResourceOpen(false))
					toast.success('Success!')
					dispatch(updateSelectedResource(undefined))
				})
				.catch((err) => {
					console.log(err)
					toast.error('Failure: Something went wrong, please try again.')
					dispatch(updateRemoveResourceOpen(false))
					dispatch(updateSelectedResource(undefined))
				})
				.finally(() => setLoading(false))
		}
	}

	return (
		<ModalShell
			title='Remove Resource'
			onClose={() => dispatch(updateRemoveResourceOpen(false))}
		>
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

					<ButtonLight
						onClick={() => {
							dispatch(updateRemoveResourceOpen(false))
							dispatch(updateSelectedResource(undefined))
						}}
					>
						Cancel
					</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default RemoveResourceModal
