import { useTranslations } from 'next-intl'
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
	const width = useScreenWidth()
	return (
		<div className='py-4'>
			<div className='mx-auto max-w-7xl'>
				<div className='grid grid-cols-1 gap-0.5 sm:mx-0 sm:rounded-2xl md:grid-cols-6'>
					<div className='flex flex-col items-center justify-center gap-2 rounded-lg bg-teal-600 p-4 text-center text-white md:col-span-1 md:rounded-r-none md:p-10'>
						<p className='text-center'>{t('overall')}</p>
						<RatingStars
							size={width < 1025 ? '4' : '5'}
							testid='cataverage'
							value={average}
						/>

						<p className='sr-only'>{t('average', { average: average })}</p>
					</div>
					<div className='flex w-full items-center justify-between rounded-lg bg-teal-600/5 p-1.5 md:flex-col md:justify-center md:gap-2 md:rounded-none md:p-10'>
						<p className='text-center'>{t('stability')}</p>
						<RatingStars
							size={width < 1025 ? '4' : '5'}
							testid='cataverage-stability'
							value={averages.avg_stability}
						/>
					</div>

					<div className='flex w-full items-center justify-between rounded-lg bg-teal-600/5 p-1 md:flex-col md:justify-center md:gap-2 md:rounded-none md:p-10'>
						<p className='text-center'>{t('respect')}</p>
						<RatingStars
							size={width < 1025 ? '4' : '5'}
							testid='cataverage-respect'
							value={averages.avg_respect}
						/>
					</div>
					<div className='flex w-full items-center justify-between rounded-lg bg-teal-600/5 p-1 md:flex-col md:justify-center md:gap-2 md:rounded-none md:p-10'>
						<p className='text-center'>{t('health')}</p>
						<RatingStars
							size={width < 1025 ? '4' : '5'}
							testid='cataverage-health'
							value={averages.avg_health}
						/>
					</div>
					<div className='flex w-full items-center justify-between rounded-lg bg-teal-600/5 p-1 md:flex-col md:justify-center md:gap-2 md:rounded-none md:p-10'>
						<p className='text-center'>{t('privacy')}</p>
						<RatingStars
							size={width < 1025 ? '4' : '5'}
							testid='cataverage-privacy'
							value={averages.avg_privacy}
						/>
					</div>
					<div className='flex w-full items-center justify-between rounded-lg bg-teal-600/5 p-1 md:flex-col md:justify-center md:gap-2 md:rounded-l-none md:p-10'>
						<p className='text-center'>{t('repair')}</p>
						<RatingStars
							size={width < 1025 ? '4' : '5'}
							testid='cataverage-repair'
							value={averages.avg_repair}
						/>
					</div>
				</div>
				<p className='ml-2 text-center text-sm text-gray-900 md:text-right'>
					{t('total', { total: total })}
				</p>
			</div>
		</div>
	)
}
