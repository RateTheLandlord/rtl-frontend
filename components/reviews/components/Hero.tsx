import ReviewHero from './ReviewHero'
import LocationForm from './LocationForm'
import { Options } from '@/util/interfaces/interfaces'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/button'
import Image from 'next/image'

interface IProps {
	loading: boolean
	countryFilter: Options | null
	stateFilter: Options | null
	dynamicStateOptions: Options[]
	fetchDynamicFilterOptions: () => Promise<void>
	handleSubmit: () => Promise<void>
}

const Hero = ({
	loading,
	countryFilter,
	stateFilter,
	dynamicStateOptions,
	fetchDynamicFilterOptions,
	handleSubmit,
}: IProps) => {
	return (
		<div className='m-2 w-full  max-w-7xl'>
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
							<div className='w-full p-8 transition-all duration-500'>
								<LocationForm
									countryFilter={countryFilter}
									stateFilter={stateFilter}
									dynamicStateOptions={dynamicStateOptions}
									fetchDynamicFilterOptions={fetchDynamicFilterOptions}
								/>
							</div>

							<div className='flex w-full justify-center'>
								{loading ? (
									<Spinner />
								) : !countryFilter || !stateFilter ? null : (
									<Button
										disabled={!countryFilter || !stateFilter}
										onClick={() => handleSubmit()}
										size='large'
									>
										Continue
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
