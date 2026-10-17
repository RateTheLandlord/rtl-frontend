import TextInput from '@/components/ui/TextInput'
import LargeTextInput from '@/components/ui/LargeTextInput'
import { useState } from 'react'
import { useAppDispatch } from '@/redux/hooks'

import { updateAddFlaggedKeywordOpen } from '@/redux/modal/modalSlice'
import { toast } from 'react-toastify'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/button'
import ButtonLight from '@/components/ui/button-light'
import ModalShell from './ModalShell'

const AddFlaggedKeywordModal = () => {
	const dispatch = useAppDispatch()
	const [keyword, setKeyword] = useState('')
	const [keywordReason, setKeywordReason] = useState('')
	const [loading, setLoading] = useState(false)

	const resetForm = () => {
		setKeyword('')
		setKeywordReason('')
	}

	const onSubmitFlaggedKeyword = () => {
		setLoading(true)
		const newKeyword = {
			keyword: keyword,
			reason: keywordReason,
		}

		fetch('/api/flagged-keywords/add-flagged-keyword', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newKeyword),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				}
			})
			.then(() => {
				dispatch(updateAddFlaggedKeywordOpen(false))
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
			title='Add Flagged Keyword'
			onClose={() => dispatch(updateAddFlaggedKeywordOpen(false))}
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
									title='Keyword'
									value={keyword}
									setValue={setKeyword}
									id='keyword'
									placeHolder='Keyword'
								/>

								<LargeTextInput
									title='Reason'
									setValue={setKeywordReason}
									value={keywordReason}
									id='reason'
								/>
							</div>
						</div>
					</div>
				</form>
				<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
					{loading ? (
						<Spinner />
					) : (
						<Button disabled={loading} onClick={() => onSubmitFlaggedKeyword()}>
							Submit
						</Button>
					)}
					<ButtonLight
						onClick={() => dispatch(updateAddFlaggedKeywordOpen(false))}
					>
						Cancel
					</ButtonLight>
				</div>
			</>
		</ModalShell>
	)
}

export default AddFlaggedKeywordModal
