import { Adsense } from '@ctrl/react-adsense'

const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'

export enum AD_UNITS {
	HOMEPAGE = '2964662882',
	REVIEWS = '2009320000',
	CITIES = '1526837416',
	RESOURCES = '9611751505',
	REVIEW_FEED = '6478597563',
	LANDLORD = '7870561123',
	ZIP = '4252935656',
}

interface IProps {
	slot: AD_UNITS
}

const AdsComponent = ({ slot }: IProps) => {
	if (isProd) {
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

	return (
		<div className='w-full overflow-hidden px-4 pt-4 sm:px-6 lg:px-8'>
			<div className='mx-auto w-full max-w-[320px] bg-red-500 sm:max-w-[468px] lg:max-w-[728px]'>
				AD
			</div>
		</div>
	)
}

export default AdsComponent
