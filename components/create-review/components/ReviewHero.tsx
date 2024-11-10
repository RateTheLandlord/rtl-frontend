import { HouseIcon } from '@/components/icons/HouseIcon'
import Button from '@/components/ui/button'
import { classNames } from '@/util/helpers/helper-functions'

interface IProps {
	getStarted: boolean
	setGetStarted: (bool: boolean) => void
	setLandlordOpen: (bool: boolean) => void
}

const ReviewHero = ({ getStarted, setGetStarted, setLandlordOpen }: IProps) => {
	return (
		<div
			className={classNames(
				'flex flex-col items-center justify-center',
				getStarted ? '' : 'lg:h-full',
			)}
		>
			<div className='mt-2 flex flex-col items-center justify-center gap-4 rounded-3xl bg-gray-100 p-4'>
				{getStarted ? null : (
					<div className='mx-auto flex max-w-2xl lg:max-w-none lg:flex-none'>
						<div className='max-w-3xl flex-none sm:max-w-5xl lg:max-w-none'>
							<HouseIcon className='h-80 w-80 md:h-[500px] md:w-[500px]' />
						</div>
					</div>
				)}
				<h1 className='text-center text-4xl'>
					Help Us Create a Better Living Experience!
				</h1>
				<div className='my-3 flex w-full flex-col gap-3 text-center lg:px-10'>
					<p>
						Thank you for reviewing your landlord! Your feedback on maintenance,
						communication, and overall satisfaction will help tenants in your
						area make informed housing decisions.
					</p>
				</div>
				{getStarted ? null : (
					<Button
						size='large'
						onClick={() => {
							setGetStarted(true)
							setLandlordOpen(true)
						}}
					>
						Start a Review
					</Button>
				)}
			</div>
		</div>
	)
}

export default ReviewHero
