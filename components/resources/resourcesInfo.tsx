import { useTranslations } from 'next-intl'

const ResourcesInfo = () => {
	const t = useTranslations('resources')
	const keys = ['info-1', 'info-2'] as const
	return (
		<div data-testid='about-Resources-1' className='w-full bg-white'>
			<div className='mx-auto max-w-7xl px-6 text-lg lg:px-8'>
				<h1>
					<span className='mt-2 block text-center text-3xl leading-8 text-gray-900 sm:text-4xl'>
						{t('title')}
					</span>
				</h1>
				<p className='mt-8 text-center text-xl leading-8 text-gray-500'>
					{t('description')}
				</p>
				{keys.map((item, i) => {
					return (
						<p key={i} className='mt-8 text-xl leading-8 text-gray-500'>
							{t(item)}
						</p>
					)
				})}
			</div>
		</div>
	)
}

export default ResourcesInfo
