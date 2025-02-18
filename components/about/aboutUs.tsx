import { useTranslations } from 'next-intl'

const AboutUs = () => {
	const t = useTranslations('about')
	const keys = [
		'about-us.info-1',
		'about-us.info-2',
		'about-us.info-3',
		'about-us.info-4',
	] as const

	return (
		<div data-testid='about-aboutus-1' className='w-full bg-white'>
			<div className='mx-auto max-w-7xl px-6 text-lg lg:px-8'>
				<h1>
					<span className='mt-2 block text-center text-3xl leading-8 text-gray-900 sm:text-4xl'>
						{t('about-us.about')}
					</span>
				</h1>
				{keys.map((item, i) => {
					return (
						<p
							key={i}
							className='mt-8 text-center text-xl leading-8 text-gray-500'
						>
							{t(item)}
						</p>
					)
				})}
			</div>
		</div>
	)
}

export default AboutUs
