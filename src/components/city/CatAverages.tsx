import { useLocale, useTranslations } from 'next-intl'
import RatingStars from '../ui/RatingStars'
import useScreenWidth from '@/util/hooks/useScreenWidth'

interface IProps {
	averages: {
		avg_repair: number
		avg_health: number
		avg_stability: number
		avg_privacy: number
		avg_respect: number
	}
	average: number
	total: number
}

export default function CatAverages({ averages, average, total }: IProps) {
	const t = useTranslations('landlord')
	const locale = useLocale()
	const width = useScreenWidth()
	const formatRating = (rating: number) =>
		new Intl.NumberFormat(locale, {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1,
		}).format(rating)

	return (
		<div className='py-4'>
			<div className='mx-auto max-w-7xl'>
				<div className='grid grid-cols-1 gap-0.5 sm:mx-0 sm:rounded-2xl md:grid-cols-6'>
					<div className='bg-primary flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center text-white md:col-span-1 md:rounded-r-none md:p-10'>
						<p className='text-center'>{t('overall')}</p>
						<RatingStars
							size={width < 1025 ? '4' : '5'}
							testid='cataverage'
							value={Math.round(average)}
						/>
						<p className='text-sm font-semibold'>
							{t('score', { rating: formatRating(average) })}
						</p>
						<p className='sr-only'>
							{t('average', { average: formatRating(average) })}
						</p>
					</div>
					<div className='bg-primary/5 flex w-full items-center justify-between rounded-lg p-1.5 md:flex-col md:justify-center md:gap-2 md:rounded-none md:p-10'>
						<p className='text-center'>{t('stability')}</p>
						<div className='flex items-center gap-2 md:flex-col md:gap-1'>
							<RatingStars
								size={width < 1025 ? '4' : '5'}
								testid='cataverage-stability'
								value={Math.round(averages.avg_stability)}
							/>
							<span className='text-sm font-medium'>
								{t('score', { rating: formatRating(averages.avg_stability) })}
							</span>
						</div>
					</div>

					<div className='bg-primary/5 flex w-full items-center justify-between rounded-lg p-1 md:flex-col md:justify-center md:gap-2 md:rounded-none md:p-10'>
						<p className='text-center'>{t('respect')}</p>
						<div className='flex items-center gap-2 md:flex-col md:gap-1'>
							<RatingStars
								size={width < 1025 ? '4' : '5'}
								testid='cataverage-respect'
								value={Math.round(averages.avg_respect)}
							/>
							<span className='text-sm font-medium'>
								{t('score', { rating: formatRating(averages.avg_respect) })}
							</span>
						</div>
					</div>
					<div className='bg-primary/5 flex w-full items-center justify-between rounded-lg p-1 md:flex-col md:justify-center md:gap-2 md:rounded-none md:p-10'>
						<p className='text-center'>{t('health')}</p>
						<div className='flex items-center gap-2 md:flex-col md:gap-1'>
							<RatingStars
								size={width < 1025 ? '4' : '5'}
								testid='cataverage-health'
								value={Math.round(averages.avg_health)}
							/>
							<span className='text-sm font-medium'>
								{t('score', { rating: formatRating(averages.avg_health) })}
							</span>
						</div>
					</div>
					<div className='bg-primary/5 flex w-full items-center justify-between rounded-lg p-1 md:flex-col md:justify-center md:gap-2 md:rounded-none md:p-10'>
						<p className='text-center'>{t('privacy')}</p>
						<div className='flex items-center gap-2 md:flex-col md:gap-1'>
							<RatingStars
								size={width < 1025 ? '4' : '5'}
								testid='cataverage-privacy'
								value={Math.round(averages.avg_privacy)}
							/>
							<span className='text-sm font-medium'>
								{t('score', { rating: formatRating(averages.avg_privacy) })}
							</span>
						</div>
					</div>
					<div className='bg-primary/5 flex w-full items-center justify-between rounded-lg p-1 md:flex-col md:justify-center md:gap-2 md:rounded-l-none md:p-10'>
						<p className='text-center'>{t('repair')}</p>
						<div className='flex items-center gap-2 md:flex-col md:gap-1'>
							<RatingStars
								size={width < 1025 ? '4' : '5'}
								testid='cataverage-repair'
								value={Math.round(averages.avg_repair)}
							/>
							<span className='text-sm font-medium'>
								{t('score', { rating: formatRating(averages.avg_repair) })}
							</span>
						</div>
					</div>
				</div>
				<p className='ml-2 text-center text-sm text-gray-900 md:text-right'>
					{t('total', { total: total })}
				</p>
			</div>
		</div>
	)
}
