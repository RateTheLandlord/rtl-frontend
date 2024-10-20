import {
	CloudUploadIcon,
	ServerIcon,
	UserGroupIcon,
} from '@heroicons/react/outline'
import Patreon from '../svg/icons/patreon'
import LinkButtonLightLG from '../ui/link-button-light-lg'
import { useTranslation } from 'react-i18next'

export default function Support() {
	const { t } = useTranslation('support')

	const features = [
		{
			name: t('support.features.platform.title'),
			description: t('support.features.platform.description'),
			icon: CloudUploadIcon,
		},
		{
			name: t('support.features.maintenance.title'),
			description: t('support.features.maintenance.description'),
			icon: ServerIcon,
		},
		{
			name: t('support.features.community.title'),
			description: t('support.features.community.description'),
			icon: UserGroupIcon,
		},
	]

	return (
		<div className='py-24 sm:py-32'>
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='mx-auto max-w-2xl lg:text-center'>
					<h2 className='text-base  leading-7 text-indigo-600'>
						{t('support.support-us')}
					</h2>
					<p className='mt-2 text-3xl   text-gray-900 sm:text-4xl'>
						{t('support.header')}
					</p>
					<p className='mt-6 text-lg leading-8 text-gray-600'>
						{t('support.body-1')}
					</p>
				</div>
				<div className='mx-auto my-16 max-w-2xl sm:my-20 lg:my-24 lg:max-w-4xl'>
					<dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16'>
						{features.map((feature) => (
							<div key={feature.name} className='relative pl-16'>
								<dt className='text-base  leading-7 text-gray-900'>
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
						{t('support.body-2')}
					</p>
					<p className='mt-6 text-lg leading-8 text-gray-600'>
						{t('support.body-3')}
					</p>
				</div>
				<div className='mt-10 flex w-full justify-center'>
					<LinkButtonLightLG href='https://patreon.com/RateTheLandlord?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=creatorshare_creator&utm_content=join_link'>
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
