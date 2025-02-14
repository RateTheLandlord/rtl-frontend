import ReviewHero from './ReviewHero'
import LocationForm from './LocationForm'
import { Options } from '@/util/interfaces/interfaces'
import Image from 'next/image'
import { useState } from 'react'
import Button from '@/components/ui/button'
import { useAppDispatch } from '@/redux/hooks'
import { updateStateAndCountry } from '@/redux/query/querySlice'
import { useTranslation } from 'next-i18next'

interface IProps {
	countryFilter: Options | null
	stateFilter: Options | null
}

const Hero = ({ countryFilter, stateFilter }: IProps) => {
	const { t } = useTranslation('reviews')
	const [selectedCountry, setSelectedCountry] = useState<Options | null>(
		countryFilter,
	)
	const [selectedState, setSelectedState] = useState<Options | null>(
		stateFilter,
	)

	const dispatch = useAppDispatch()

	const handleSubmit = () => {
		if (selectedCountry && selectedState) {
			dispatch(
				updateStateAndCountry({
					country: selectedCountry,
					state: selectedState,
				}),
			)
		}
	}
	return (
		<div className='m-2 w-full max-w-7xl'>
			<div className='relative h-[850px]'>
				<div className='mx-auto max-w-7xl rounded-md bg-white/20'>
					<div className='relative z-10 lg:w-full lg:max-w-2xl'>
						<svg
							viewBox='0 0 100 100'
							preserveAspectRatio='none'
							aria-hidden='true'
							className='absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white lg:block'
						>
							<polygon points='0,0 90,0 50,100 0,100' />
						</svg>

						<div className='relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0'>
							<ReviewHero />
							<div className='w-full p-8 transition-all duration-300'>
								<LocationForm
									selectedCountry={selectedCountry}
									selectedState={selectedState}
									setSelectedCountry={setSelectedCountry}
									setSelectedState={setSelectedState}
								/>
							</div>

							<div className='flex w-full justify-center'>
								{!selectedCountry || !selectedState ? null : (
									<Button
										disabled={!selectedCountry || !selectedState}
										onClick={() => handleSubmit()}
										size='large'
									>
										{t('reviews.continue')}
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
				<div>
					{/* Mobile Image */}
					<div className='absolute inset-0 -z-10 size-full rounded-md object-cover opacity-20 lg:hidden'>
						<Image
							alt=''
							src='/review.jpg'
							fill
							className='rounded-md object-cover'
							priority
						/>
					</div>

					{/* Desktop Image */}
					<div className='hidden lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:w-1/2'>
						<Image
							alt=''
							src='/review.jpg'
							width={640}
							height={960}
							className='rounded-r-md object-cover'
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Hero
