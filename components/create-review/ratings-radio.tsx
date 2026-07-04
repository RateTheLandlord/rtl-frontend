import React from 'react'
import { Label, Radio, RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/solid'
import { classNames } from '@/util/helpers/helper-functions'
import { useTranslations } from 'next-intl'

const ratings = [1, 2, 3, 4, 5]

interface Props {
	title: string
	rating: number
	setRating: (num: number) => void
	tooltip: string
	testid: string
}

function RatingsRadio({ title, rating, setRating, tooltip, testid }: Props) {
	const t = useTranslations('createreview')

	return (
		<div
			data-testid={testid}
			title={tooltip}
			className='w-full rounded-lg p-1 sm:p-2'
		>
			<h2 className='text-primary-900 text-sm font-medium sm:text-base'>
				{title}
			</h2>

			<RadioGroup value={rating} onChange={setRating} className='mt-2 w-full'>
				<Label className='sr-only'>{t('review-radio.choose')}</Label>
				<div className='flex flex-wrap items-center gap-1 sm:gap-2'>
					{ratings.map((option) => (
						<Radio
							key={option}
							value={option}
							aria-label={`${option} ${t('review-radio.rating')}`}
							className='flex cursor-pointer items-center justify-center p-1 transition-colors hover:text-yellow-300'
						>
							<StarIcon
								className={classNames(
									rating >= option ? 'text-yellow-400' : 'text-gray-300',
									'h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12',
								)}
								aria-hidden='true'
							/>
						</Radio>
					))}
				</div>
			</RadioGroup>
		</div>
	)
}

export default RatingsRadio
