import { useTranslation } from 'react-i18next'
import RatingStars from '../ui/RatingStars'

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
	const { t } = useTranslation('landlord')
	return (
		<div className='px-2 py-4 md:px-0'>
			<div className='mx-auto max-w-7xl'>
				<div className='grid grid-cols-3 gap-0.5 sm:mx-0 sm:rounded-2xl md:grid-cols-6'>
					<div className='flex flex-col items-center justify-center gap-2 rounded-l-lg bg-teal-600 p-8 text-center text-white sm:p-10'>
						<p>Overall</p>
						<RatingStars value={average} />

						<p className='sr-only'>
							{t('landlord.average', { average: average })}
						</p>
					</div>
					<div className='flex flex-col items-center justify-center gap-2 bg-teal-600/5 p-8 sm:p-10'>
						<p>Stability</p>
						<RatingStars value={averages.avg_stability} />
					</div>

					<div className='flex flex-col items-center justify-center gap-2 rounded-r-lg bg-teal-600/5 p-8 sm:p-10 md:rounded-r-none'>
						<p>Respect</p>
						<RatingStars value={averages.avg_respect} />
					</div>
					<div className='flex flex-col items-center justify-center gap-2 rounded-l-lg bg-teal-600/5 p-8 sm:p-10 md:rounded-l-none'>
						<p>Health</p>
						<RatingStars value={averages.avg_health} />
					</div>
					<div className='flex flex-col items-center justify-center gap-2 bg-teal-600/5 p-8 sm:p-10'>
						<p>Privacy</p>
						<RatingStars value={averages.avg_privacy} />
					</div>
					<div className='flex flex-col items-center justify-center gap-2 rounded-r-lg bg-teal-600/5 p-8 sm:p-10'>
						<p>Repair</p>
						<RatingStars value={averages.avg_repair} />
					</div>
				</div>
				<p className='ml-2 text-sm text-gray-900'>
					{t('landlord.total', { total: total })}
				</p>
			</div>
		</div>
	)
}
