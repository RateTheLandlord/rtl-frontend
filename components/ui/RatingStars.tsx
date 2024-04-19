import { classNames } from '@/util/helpers/helper-functions'
import { StarIcon } from '@heroicons/react/solid'

interface IProps {
	value: number
}

const RatingStars = ({ value }: IProps) => {
	return (
		<div className='flex items-center'>
			{[0, 1, 2, 3, 4].map((rating) => (
				<StarIcon
					key={rating}
					className={classNames(
						value > rating ? 'text-yellow-400' : 'text-gray-300',
						'h-5 w-5 flex-shrink-0',
					)}
					aria-hidden='true'
				/>
			))}
		</div>
	)
}

export default RatingStars
