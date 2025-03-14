import { classNames } from '@/util/helpers/helper-functions'
import { StarIcon } from '@heroicons/react/solid'

interface IProps {
	value: number
	testid: string
	size?: string
}

const RatingStars = ({ value, testid, size = '5' }: IProps) => {
	const starSize = `h-${size} w-${size}`
	return (
		<div className='flex items-center' data-testid={testid}>
			{[0, 1, 2, 3, 4].map((rating) => (
				<StarIcon
					key={rating}
					className={classNames(
						value > rating ? 'text-yellow-400' : 'text-gray-300',
						'flex-shrink-0',
						starSize,
					)}
					aria-hidden='true'
				/>
			))}
		</div>
	)
}

export default RatingStars
