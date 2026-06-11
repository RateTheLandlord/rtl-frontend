import React from 'react'
import { Label, Radio, RadioGroup } from '@headlessui/react'
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
		<div data-testid={testid}>
			<h2 className='text-gray-900'>
				{title} {t('review-radio.rating')}
			</h2>
			<p className='text-xs text-gray-500'>{tooltip}</p>

			<RadioGroup value={rating} onChange={setRating} className='mt-2'>
				<Label className='sr-only'>{t('review-radio.choose')}</Label>
				<div className='grid grid-cols-5'>
					{ratings.map((option, i) => (
						<Radio
							data-testid={testid + option}
							key={option}
							value={option}
							className={({ checked }) =>
								classNames(
									i === 0 ? 'rounded-l-full' : 'border-l-0',
									i === 4 ? 'rounded-r-full' : 'border-r',
									checked
										? 'bg-primary hover:bg-primary-hover border-transparent text-white'
										: 'border-primary border-2 bg-white text-teal-900 hover:bg-teal-50',
									'flex cursor-pointer items-center justify-center border px-3 py-4 text-sm uppercase sm:flex-1',
								)
							}
						>
							<Label as='span'>{option}</Label>
						</Radio>
					))}
				</div>
			</RadioGroup>
		</div>
	)
}

export default RatingsRadio
