import { useTranslation } from 'react-i18next'
import Spinner from '../ui/Spinner'

interface IProps {
	landlord: string
	bannerType: string
	isOpen: boolean
}

const LandlordBanner = ({ landlord, bannerType, isOpen }: IProps) => {
	const { t } = useTranslation('landlord')

	if (!bannerType) return <Spinner />

	return (
		<>
			{isOpen ? (
				<div className='rounded-xl bg-red-200 p-1'>
					<div className='text-center sm:py-1'>
						<p>
							{t(`landlord.banner.${bannerType}.text`, { landlord: landlord })}
						</p>
					</div>
				</div>
			) : null}
		</>
	)
}

export default LandlordBanner
