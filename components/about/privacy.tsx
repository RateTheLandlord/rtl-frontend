import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const Privacy = () => {
	const { t } = useTranslation('about')
	return (
		<div data-testid='about-privacy-1' className='w-full bg-white'>
			<div className='mx-auto max-w-7xl px-6 text-lg lg:px-8'>
				<h3 className='mt-2 block text-center text-xl  leading-8  text-gray-900 sm:text-2xl'>
					{t('about.privacy.privacy')}
				</h3>
				<p className='mt-8 text-xl leading-8 text-gray-500'>
					{t('about.privacy.info')}
				</p>
				<Link href='/privacy-policy' className='text-blue-500 underline'>
					Read More
				</Link>
			</div>
		</div>
	)
}

export default Privacy
