import { classNames } from '@/util/helpers/helper-functions'

interface IProps {
	height?: string
	width?: string
	colour?: string
}

const Spinner = ({
	height = 'h-8',
	width = 'w-8',
	colour = 'text-primary',
}: IProps) => {
	return (
		<div
			className={classNames(
				'inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
				height,
				width,
				colour,
			)}
			role='status'
		>
			<span className='!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]'>
				Loading...
			</span>
		</div>
	)
}

export default Spinner
