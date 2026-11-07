import { Adsense } from '@ctrl/react-adsense'

const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'

export enum AD_UNITS {
	HOMEPAGE = '2964662882',
	REVIEWS = '2009320000',
	CITIES = '1526837416',
	RESOURCES = '9611751505',
	REVIEW_FEED = '3829259014',
	ZIP = '4252935656',
	LANDLORD = '7870561123',
}

type AdType = 'display' | 'in-feed'
type AdLayout = 'image-side' | 'image-top'

interface IProps {
	slot: AD_UNITS
	type?: AdType
	layout?: AdLayout
	layoutKey?: string
}

const AdsComponent = ({
	slot,
	type = 'display',
	layout = 'image-side',
	layoutKey,
}: IProps) => {
	if (!isProd) {
		return (
			<div className='w-full overflow-hidden px-4 pt-4 sm:px-6 lg:px-8'>
				<div className='mx-auto w-full max-w-[320px] bg-red-500 sm:max-w-[468px] lg:max-w-[728px]'>
					AD
				</div>
			</div>
		)
	}

	if (type === 'in-feed') {
		return (
			<div className='w-full overflow-hidden py-4'>
				<Adsense
					client='ca-pub-1233437669445756'
					slot={slot}
					style={{ display: 'block' }}
					format='fluid'
					layout={layout}
					layoutKey={layoutKey}
				/>
			</div>
		)
	}

	return (
		<div className='w-full overflow-hidden px-4 pt-4 sm:px-6 lg:px-8'>
			<div className='mx-auto h-[100px] w-[320px] sm:h-[60px] sm:w-[468px] lg:h-[90px] lg:w-[728px]'>
				<Adsense
					client='ca-pub-1233437669445756'
					slot={slot}
					style={{ display: 'block' }}
				/>
			</div>
		</div>
	)
}

export default AdsComponent
