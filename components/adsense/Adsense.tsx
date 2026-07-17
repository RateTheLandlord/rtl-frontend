import AdSense from 'react-adsense'

const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'

interface IProps {
	slot: string
	format?: string
	layout?: string
	layoutKey?: string
}

const AdsComponent = ({
	slot,
	format = 'horizontal,auto',
	layout = '',
	layoutKey = '',
}: IProps) => {
	if (isProd) {
		return (
			<div className='w-full overflow-hidden px-4 pt-4 sm:px-6 lg:px-8'>
				<div className='mx-auto w-full max-w-[320px] sm:max-w-[468px] lg:max-w-[728px]'>
					<AdSense.Google
						client='ca-pub-1233437669445756'
						slot={slot}
						style={{ display: 'block', maxWidth: '100%' }}
						format={format}
						layout={layout}
						layoutKey={layoutKey}
						responsive='true'
						className='adsbygoogle mx-auto block h-[100px] w-full max-w-full overflow-hidden md:h-[90px]'
					/>
				</div>
			</div>
		)
	} else {
		// For development environment, don't render the ad unit
		return (
			<div className='w-full overflow-hidden px-4 pt-4 sm:px-6 lg:px-8'>
				<div className='mx-auto flex h-[100px] w-full max-w-2xl items-center justify-center rounded bg-red-500 md:h-[90px] lg:max-w-7xl'>
					AD
				</div>
			</div>
		)
	}
}

export default AdsComponent
