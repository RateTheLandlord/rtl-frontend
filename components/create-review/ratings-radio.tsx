import React from 'react'
import { Label, Radio, RadioGroup } from '@headlessui/react'
import { classNames } from '@/util/helpers/helper-functions'
import { useTranslation } from 'react-i18next'

const ratings = [1, 2, 3, 4, 5]

interface Props {
	title: string
	rating: number
	setRating: React.Dispatch<React.SetStateAction<number>>
	tooltip: string
}

function RatingsRadio({ title, rating, setRating, tooltip }: Props) {
	const { t } = useTranslation('create')

	return (
		<div data-testid='ratings-radio-1'>
			<h2 className=' text-gray-900'>
				{title} {t('create-review.review-radio.rating')}
			</h2>
			<p className='text-xs text-gray-500'>{tooltip}</p>

			<RadioGroup value={rating} onChange={setRating} className='mt-2'>
				<Label className='sr-only'>
					{t('create-review.review-radio.choose')}
				</Label>
				<div className='grid grid-cols-5'>
					{ratings.map((option, i) => (
						<Radio
							key={option}
							value={option}
							className={({ checked }) =>
								classNames(
									i === 0 ? 'rounded-l-full' : 'border-l-0',
									i === 4 ? 'rounded-r-full' : 'border-r-1',
									checked
										? 'border-transparent bg-teal-600 text-white hover:bg-teal-700'
										: 'border-2 border-teal-600 bg-white text-teal-900 hover:bg-teal-50',
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
