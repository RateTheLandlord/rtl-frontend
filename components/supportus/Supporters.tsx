import { MemberData, TierData } from '@/util/helpers/patreon'

interface IProps {
	members: Array<MemberData>
	tiers: Array<TierData>
}

export default function Supporters({ members, tiers }: IProps) {
	const getTierName = (id: number) => {
		const found = tiers.find((tier) => tier.id === id)
		return found?.name
	}
	return (
		<div>
			<h3 className='text-center text-4xl '>Our Generous Supporters</h3>
			<div className='mx-auto mt-3 max-w-7xl px-6 lg:px-8'>
				<div className='grid grid-cols-2 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-4'>
					{members
						.map((member) => {
							const tierName = getTierName(member.id)
							if (tierName === 'Free' || tierName === undefined) {
								return null
							}
							return (
								<div
									key={member.name}
									className='bg-gray-400/5 p-8 text-center sm:p-10'
								>
									<div>
										<h6 className='text-xl '>{member.name}</h6>
										<p>{tierName}</p>
									</div>
								</div>
							)
						})
						.reverse()}
				</div>
			</div>
		</div>
	)
}
