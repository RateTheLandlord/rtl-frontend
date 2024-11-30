import { useTranslation } from 'react-i18next'

const ReviewHero = () => {
	const { t } = useTranslation('reviews')
	return (
		<div>
			<h1 className='text-center text-4xl'>{t('reviews.hero_header')}</h1>
			<div className='my-3 flex w-full flex-col gap-3 text-center lg:px-10'>
				<p>{t('reviews.hero_body')}</p>
			</div>
		</div>
	)
}

export default ReviewHero
