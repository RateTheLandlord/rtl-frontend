import { XIcon } from '@heroicons/react/solid'
interface IProps {
	onClick: () => void
}
const CloseButton = ({ onClick }: IProps) => {
	return (
		<div className='absolute top-0 right-0 hidden pt-4 pr-4 sm:block'>
			<button
				type='button'
				className='cursor-pointer rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none'
				onClick={onClick}
			>
				<span className='sr-only'>Close</span>
				<XIcon className='h-6 w-6' aria-hidden='true' />
			</button>
		</div>
	)
}

export default CloseButton
