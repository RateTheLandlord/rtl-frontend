import { ILocationType } from './Map'

interface IProps {
	location: ILocationType | null
	selectedPoint: ILocationType | null
	setSelectedPoint: (loc: ILocationType | null) => void
}

const CustomMarker = ({
	location,
	selectedPoint,
	setSelectedPoint,
}: IProps) => {
	return (
		<span
			onClick={() => setSelectedPoint(location)}
			aria-hidden='true'
			className='relative z-50 flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center'
		>
			<span
				className={`absolute rounded-full ${
					selectedPoint === location
						? 'h-6 w-6 bg-white'
						: 'h-4 w-4 bg-teal-200'
				}`}
			/>
			<span className='relative block h-2 w-2 rounded-full bg-teal-600' />
		</span>
	)
}

export default CustomMarker
