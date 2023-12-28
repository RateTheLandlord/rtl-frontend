import {
	CloudUploadIcon,
	ServerIcon,
	UserGroupIcon,
} from '@heroicons/react/outline'
import Patreon from '../svg/icons/patreon'
import LinkButtonLightLG from '../ui/link-button-light-lg'

const features = [
	{
		name: 'Platform Enhancements',
		description:
			'Supporting ongoing development to introduce new features and improve user experience.',
		icon: CloudUploadIcon,
	},
	{
		name: 'Server Maintenance',
		description:
			'Ensuring our platform stays accessible and reliable for users worldwide.',
		icon: ServerIcon,
	},
	{
		name: 'Community Initiatives',
		description:
			'Enabling us to host events and campaigns that bring our community together.',
		icon: UserGroupIcon,
	},
]

export default function Support() {
	return (
		<div className='py-24 sm:py-32'>
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='mx-auto max-w-2xl lg:text-center'>
					<h2 className='text-base font-semibold leading-7 text-indigo-600'>
						Support Us
					</h2>
					<p className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
						Support Rate The Landlord in our journey
					</p>
					<p className='mt-6 text-lg leading-8 text-gray-600'>
						Rate The Landlord is on a mission to empower renters, promote
						transparency, and build a global community dedicated to fostering
						positive landlord-tenant relationships. As we continue to grow and
						enhance our platform, we're faced with various operational
						costs—from server maintenance to development resources.
					</p>
				</div>
				<div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl'>
					<dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16'>
						{features.map((feature) => (
							<div key={feature.name} className='relative pl-16'>
								<dt className='text-base font-semibold leading-7 text-gray-900'>
									<div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600'>
										<feature.icon
											className='h-6 w-6 text-white'
											aria-hidden='true'
										/>
									</div>
									{feature.name}
								</dt>
								<dd className='mt-2 text-base leading-7 text-gray-600'>
									{feature.description}
								</dd>
							</div>
						))}
					</dl>
				</div>
				<div className='mx-auto max-w-2xl lg:text-center'>
					<p className='mt-6 text-lg leading-8 text-gray-600'>
						Until now, the site has been supported by Ad Revenue, but it doesn't
						always cover our monthly costs to keep the site running. If we want
						to continue to grow the site and offer more resources, we need the
						support of the community.
					</p>
					<p className='mt-6 text-lg leading-8 text-gray-600'>
						Rest assured though that we are NOT using this platform as a way to
						enrich ourselves. Any money left over after overhead costs will be
						put right back into site through various means such as advertising,
						updating our UI/UX design, or a number of other ways to help enhance
						the Tenant experience. We'll also periodically donate to local
						Tenant Union's and resources to help spread the support!
					</p>
				</div>
				<div className='mt-10 flex w-full justify-center'>
					<LinkButtonLightLG
						umami='Support Us - Patreon'
						href='https://patreon.com/RateTheLandlord?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=creatorshare_creator&utm_content=join_link'
					>
						<div className='flex w-full items-center justify-center gap-2'>
							<Patreon />
							Patreon
						</div>
					</LinkButtonLightLG>
				</div>
			</div>
		</div>
	)
}
