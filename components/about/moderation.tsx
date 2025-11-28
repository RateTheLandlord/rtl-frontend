import { useTranslations } from 'next-intl'

const Moderation = () => {
	const t = useTranslations('about')
	const keys = [
		'moderation.info-1',
		'moderation.info-2',
		'moderation.info-3',
		'moderation.info-4',
		'moderation.info-5',
		'moderation.info-6',
	] as const

	return (
		<div data-testid='about-moderation-1' className='w-full bg-white'>
			<div className='mx-auto max-w-7xl px-6 text-lg lg:px-8'>
				<h3 className='mt-2 block text-center text-xl leading-8 text-gray-900 sm:text-2xl'>
					{t('moderation.moderation')}
				</h3>
				{keys.map((p, i) => {
					return (
						<p
							role='paragraph'
							key={i}
							className='mt-8 text-xl leading-8 text-gray-500'
						>
							{t(p)}
						</p>
					)
				})}
			</div>
		</div>
	)
}

export default Moderation
