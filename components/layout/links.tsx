import { ILinks, INav } from '@/util/interfaces/interfaces'
import Instagram from '@/components/svg/social/instagram'

export const navigation: INav[] = [
	{
		href: '/reviews',
		name: 'nav.reviews',
	},
	{
		href: '/resources',
		name: 'nav.resources',
	},
	{
		href: '/about',
		name: 'nav.about',
	},
	{
		href: '/faq',
		name: 'nav.faq',
	},
]

export const socialLinks: ILinks[] = [
	{
		name: 'Instagram',
		href: 'https://www.instagram.com/ratethelandlord',
		icon: <Instagram />,
	},
]
