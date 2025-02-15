import { Dispatch, Fragment, SetStateAction } from 'react'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import Spinner from '../ui/Spinner'
import CloseButton from '../ui/CloseButton'
import Button from '../ui/button'
import ButtonLight from '../ui/button-light'

interface IProps {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	title: string
	description?: string
	element: JSX.Element
	onSubmit: (id: number) => void
	selectedId: number
	loading: boolean
}

const Modal = ({
	open,
	setOpen,
	title,
	description,
	element,
	onSubmit,
	selectedId,
	loading,
}: IProps) => {
	return (
		<Transition.Root show={open} as={Fragment} data-testid='modal-1'>
			<Dialog as='div' className='relative z-50' onClose={setOpen}>
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
								<CloseButton onClick={() => setOpen(false)} />
								<div className='sm:flex sm:items-start'>
									<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
										<Dialog.Title
											as='h3'
											className='text-lg leading-6 text-gray-900'
										>
											{title}
										</Dialog.Title>
										<div className='mt-2'>
											<p className='text-sm text-gray-500'>{description}</p>
										</div>
									</div>
								</div>
								<div>{element}</div>
								<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
									{loading ? (
										<Spinner />
									) : (
										<Button
											disabled={loading}
											onClick={() => onSubmit(selectedId)}
										>
											Submit
										</Button>
									)}
									<ButtonLight onClick={() => setOpen(false)}>
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

export default Modal
