import { Fragment, type ReactNode } from 'react'
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from '@headlessui/react'

type ModalShellProps = {
	title: string
	onClose: () => void
	children: ReactNode
	maxWidth?: string
}

export default function ModalShell({
	title,
	onClose,
	children,
	maxWidth = 'sm:max-w-lg',
}: ModalShellProps) {
	return (
		<Transition show as={Fragment}>
			<Dialog as='div' className='relative z-50' onClose={onClose}>
				<TransitionChild
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-gray-500/75' />
				</TransitionChild>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4'>
						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:scale-95'
						>
							<DialogPanel
								className={`relative w-full ${maxWidth} transform rounded-lg bg-white p-6 text-left shadow-xl transition-all`}
							>
								<DialogTitle className='text-lg font-semibold text-gray-900'>
									{title}
								</DialogTitle>

								{children}
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
