import { IZipLocations } from '@/lib/location/types'
import posthog from 'posthog-js'

interface IProps {
	location: IZipLocations | null
	selectedPoint: IZipLocations | null
	setSelectedPoint: (loc: IZipLocations | null) => void
}

const CustomMarker = ({
	location,
	selectedPoint,
	setSelectedPoint,
}: IProps) => {
	return (
		<span
			onClick={() => {
				posthog.capture('reviews_map_marker_clicked', {
					source: 'reviews_map',
				})

				setSelectedPoint(location)
			}}
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
			<span className='bg-primary relative block h-2 w-2 rounded-full' />
		</span>
	)
}

export default CustomMarker
