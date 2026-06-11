import { Fragment, useState } from 'react'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import Button from '../ui/button'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	updateCopyUserCodeOpen,
	updateSuccessModalOpen,
} from '@/redux/modal/modalSlice'

const CopyUserCodeModal = () => {
	const { copyUserCodeOpen: open, userKey: code } = useAppSelector(
		(state) => state.modal,
	)
	const dispatch = useAppDispatch()
	const t = useTranslations('user-code')
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000) // reset after 2s
		} catch (err) {
			console.error('Failed to copy:', err)
		}
	}

	return (
		<Transition.Root show={open} as={Fragment} data-testid='modal-1'>
			<Dialog as='div' className='relative z-50' onClose={() => {}}>
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
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
										<Dialog.Title
											as='h3'
											className='text-lg leading-6 text-gray-900'
										>
											{t('title')}
										</Dialog.Title>
										<div className='my-2 flex flex-col gap-3'>
											<p>{t('success')}</p>

											<p>{t('message')}</p>

											<p>{t('faq')}</p>
										</div>
									</div>
								</div>
								<div className='flex justify-center'>
									<div className='rounded-l-md border border-black p-2'>
										{code}
									</div>
									<button
										onClick={() => void handleCopy()}
										className='w-1/2 flex-none cursor-pointer rounded-r-md bg-[#7e9860] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7e9860]'
									>
										{copied ? `${t('copied')}` : `${t('copy')}`}
									</button>
								</div>
								<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
									<Button
										onClick={() => {
											dispatch(updateCopyUserCodeOpen(false))
											dispatch(updateSuccessModalOpen(true))
										}}
									>
										{t('button')}
									</Button>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default CopyUserCodeModal
