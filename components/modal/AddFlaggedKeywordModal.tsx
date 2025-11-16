import TextInput from '@/components/ui/TextInput'
import LargeTextInput from '@/components/ui/LargeTextInput'
import { Fragment, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { updateAddFlaggedKeywordOpen } from '@/redux/modal/modalSlice'
import CloseButton from '@/components/ui/CloseButton'
import { toast } from 'react-toastify'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/button'
import ButtonLight from '@/components/ui/button-light'

const AddFlaggedKeywordModal = () => {
	const { addFlaggedKeywordOpen: open } = useAppSelector((state) => state.modal)
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
		<Transition.Root show={open} as={Fragment} data-testid='modal-1'>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={() => dispatch(updateAddFlaggedKeywordOpen(false))}
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
									onClick={() => dispatch(updateAddFlaggedKeywordOpen(false))}
								/>
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
										<Dialog.Title
											as='h3'
											className='text-lg leading-6 text-gray-900'
										>
											Add Flagged Keyword
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
										<Button
											disabled={loading}
											onClick={() => onSubmitFlaggedKeyword()}
										>
											Submit
										</Button>
									)}
									<ButtonLight
										onClick={() => dispatch(updateAddFlaggedKeywordOpen(false))}
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

export default AddFlaggedKeywordModal
