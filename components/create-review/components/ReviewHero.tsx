import { HouseIcon } from '@/components/icons/HouseIcon'
import Button from '@/components/ui/button'
import { classNames } from '@/util/helpers/helper-functions'
import { useTranslation } from 'react-i18next'

interface IProps {
	getStarted: boolean
	setGetStarted: (bool: boolean) => void
	setLandlordOpen: (bool: boolean) => void
}

const ReviewHero = ({ getStarted, setGetStarted, setLandlordOpen }: IProps) => {
	const { t } = useTranslation('create')
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
					{t('create-review.hero.title')}
				</h1>
				<div className='my-3 flex w-full flex-col gap-3 text-center lg:px-10'>
					<p>{t('create-review.hero.body')}</p>
				</div>
				{getStarted ? null : (
					<Button
						size='large'
						onClick={() => {
							setGetStarted(true)
							setLandlordOpen(true)
						}}
					>
						{t('create-review.hero.start')}
					</Button>
				)}
			</div>
		</div>
	)
}

export default ReviewHero
