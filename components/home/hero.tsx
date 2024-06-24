import { useTranslation } from 'react-i18next'
import LinkButtonLG from '../ui/link-button-lg'
import LinkButtonLightLG from '../ui/link-button-light-lg'
import { HouseIcon } from '../icons/HouseIcon'

function Hero(): JSX.Element {
	const { t } = useTranslation('home')
	return (
		<div
			data-testid='home-hero-1'
			className='mx-auto flex max-w-7xl flex-col px-6 pb-12 pt-10 sm:pb-16 lg:flex-row lg:items-center lg:px-8'
		>
			<div className='mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0'>
				<h1 className='mt-10 text-center text-4xl  text-teal-600 sm:text-6xl lg:text-left'>
					{t('home.hero.title')}
				</h1>
				<p className='mt-6 text-center text-lg leading-8 text-gray-600 lg:text-left'>
					{t('home.hero.body')}
				</p>
				<div className='mt-5 flex flex-col gap-3 text-center sm:w-full sm:flex-row sm:items-center sm:justify-center md:mt-8 lg:max-w-md lg:justify-start'>
					<LinkButtonLG href='/create-review'>
						{t('home.hero.submit')}
					</LinkButtonLG>
					<LinkButtonLightLG href='/reviews'>
						{t('home.hero.read')}
					</LinkButtonLightLG>
				</div>
			</div>
			<div className='mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32'>
				<div className='max-w-3xl flex-none sm:max-w-5xl lg:max-w-none'>
					<HouseIcon className='h-80 w-80 md:h-[500px] md:w-[500px]' />
				</div>
			</div>
		</div>
	)
}

export default Hero
