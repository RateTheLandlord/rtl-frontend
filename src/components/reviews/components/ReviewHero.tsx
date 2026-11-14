import { useTranslations } from 'next-intl'

const ReviewHero = () => {
	const t = useTranslations('reviews')
	return (
		<div>
			<h1 className='text-center text-4xl'>{t('hero_header')}</h1>
			<div className='my-3 flex w-full flex-col gap-3 text-center lg:px-10'>
				<p>{t('hero_body')}</p>
			</div>
		</div>
	)
}

export default ReviewHero
