import Link from 'next/link'
import { Disclosure, DisclosureButton } from '@headlessui/react'
import { INav } from '@/util/interfaces/interfaces'
import { useTranslations } from 'next-intl'

interface IProps {
	navigation: INav[]
	activeTab: string
}
const MobileNav = ({ navigation, activeTab }: IProps) => {
	const t = useTranslations('layout')
	return (
		<Disclosure.Panel className='lg:hidden'>
			<div className='space-y-1 pt-2 pb-3'>
				{navigation.map((link) => (
					<Link key={link.href} href={link.href}>
						<DisclosureButton
							as='a'
							className={`bg-primary/5 text-primary block cursor-pointer py-2 pr-4 pl-3 text-base ${
								activeTab === link.href
									? 'border-primary bg-primary/5 border-l-4'
									: 'bg-white'
							}`}
						>
							{t(link.name)}
						</DisclosureButton>
					</Link>
				))}
				<Link href='/create-review'>
					<DisclosureButton
						as='a'
						className={`block cursor-pointer py-2 pr-4 pl-3 text-base text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 ${
							activeTab === '/create-review' ? 'border-primary border-l-4' : ''
						}`}
					>
						{t('nav.submit')}
					</DisclosureButton>
				</Link>
			</div>
		</Disclosure.Panel>
	)
}

export default MobileNav
