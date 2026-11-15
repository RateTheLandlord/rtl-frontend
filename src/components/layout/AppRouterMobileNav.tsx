'use client'

import { Link } from '@/i18n/navigation'
import { DisclosureButton, DisclosurePanel } from '@headlessui/react'
import type { INav } from '@/util/interfaces/Interfaces'
import { useTranslations } from 'next-intl'

export default function AppRouterMobileNav({
	navigation,
	activeTab,
}: {
	navigation: INav[]
	activeTab: string
}) {
	const t = useTranslations('layout')

	return (
		<DisclosurePanel className='lg:hidden'>
			<div className='space-y-1 pt-2 pb-3'>
				{navigation.map((item) => (
					<Link key={item.href} href={item.href}>
						<DisclosureButton
							className={`bg-primary/5 text-primary block cursor-pointer py-2 pr-4 pl-3 text-base ${
								activeTab === item.href
									? 'border-primary bg-primary/5 border-l-4'
									: 'bg-white'
							}`}
						>
							{t(item.name)}
						</DisclosureButton>
					</Link>
				))}
				<Link href='/create-review'>
					<DisclosureButton className='block cursor-pointer py-2 pr-4 pl-3 text-base text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'>
						{t('nav.submit')}
					</DisclosureButton>
				</Link>
			</div>
		</DisclosurePanel>
	)
}
