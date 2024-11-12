import { SuspiciousLandlord } from '@/util/interfaces/interfaces'

interface IProps {
	landlord: SuspiciousLandlord
}

const LandlordBanner = ({ landlord }: IProps) => {
	return (
		<div className='rounded-xl bg-red-200 p-1'>
			<div className='text-center sm:py-1'>
				<p>{landlord.message}</p>
			</div>
		</div>
	)
}

export default LandlordBanner
