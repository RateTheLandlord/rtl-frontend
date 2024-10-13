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
			<div className='mt-2 flex flex-col items-center justify-center gap-4 rounded-3xl bg-gray-100 p-4 lg:mt-0'>
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
						We value your input and want to ensure that everyone enjoys a
						supportive and responsive living environment. To help us achieve
						this, we invite you to take a moment to rate your landlord using our
						feedback form.
					</p>
					<p>
						Your thoughts are crucial in identifying areas for improvement and
						recognizing what&apos;s working well. Whether it&apos;s
						communication, maintenance responsiveness, or overall satisfaction,
						your feedback will guide us in making positive changes for
						everyone&apos;s benefit.
					</p>
					<p>
						Thank you for sharing your insights! Together, we can enhance our
						community and create a more enjoyable living experience for all
						residents.
					</p>
				</div>
				{getStarted ? null : (
					<Button
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
