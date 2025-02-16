import { useTranslations } from 'next-intl'

const Contact = () => {
	const t = useTranslations('about')
	return (
		<div data-testid='about-contact-1'>
			<h3>
				<span className='mt-2 block text-center text-xl leading-8 text-gray-900 sm:text-2xl'>
					{t('contact.title')}
				</span>
			</h3>
			<div className='text-center'>
				<a
					href='mailto:contact@ratethelandlord.org'
					className='mt-8 text-xl leading-8 text-gray-500'
				>
					{t('contact.email')}
				</a>
			</div>
		</div>
	)
}

export default Contact
