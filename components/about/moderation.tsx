import { useTranslation } from 'react-i18next'

const Moderation = () => {
	const { t } = useTranslation('about')
	const info: Array<string> = t('about.moderation.info', {
		returnObjects: true,
	})

	return (
		<div data-testid='about-moderation-1' className='w-full bg-white'>
			<div className='mx-auto max-w-7xl px-6 text-lg lg:px-8'>
				<h3 className='mt-2 block text-center text-xl  leading-8  text-gray-900 sm:text-2xl'>
					{t('about.moderation.moderation')}
				</h3>
				{info.map((p, i) => {
					return (
						<p
							role='paragraph'
							key={i}
							className='mt-8 text-xl leading-8 text-gray-500'
						>
							{p}
						</p>
					)
				})}
			</div>
		</div>
	)
}

export default Moderation
