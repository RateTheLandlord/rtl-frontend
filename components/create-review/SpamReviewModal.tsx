import React, { Fragment, SetStateAction } from 'react'
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import Button from '../ui/button'
import posthog from 'posthog-js'
import { useTranslations } from 'next-intl'

interface IProps {
	isOpen: boolean
	setIsOpen: React.Dispatch<SetStateAction<boolean>>
	detectionMethod: string
}

function SpamReviewModal({ isOpen, setIsOpen, detectionMethod }: IProps) {
	const t = useTranslations('createreview')
	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={setIsOpen}>
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
								<div>
									<div className='mt-3 text-center sm:mt-5'>
										<DialogTitle
											as='h3'
											className='text-base leading-6 text-gray-900'
										>
											{t(`${detectionMethod}.title`)}
										</DialogTitle>
										<div className='mt-2'>
											<p className='text-sm text-gray-500'>
												{t(`${detectionMethod}.description`)}
											</p>
										</div>
									</div>
								</div>
								<div className='mt-5 flex w-full justify-end sm:mt-6'>
									<Button
										onClick={() => {
											setIsOpen(false)
											posthog.capture('spam_modal_viewed')
										}}
									>
										{t('modal.close')}
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

export default SpamReviewModal
