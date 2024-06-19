import { ILinks, INav } from '@/util/interfaces/interfaces'
import Instagram from '@/components/svg/social/instagram'
import Twitter from '@/components/svg/social/twitter'
import TikTok from '@/components/svg/social/tiktok'
import Facebook from '../svg/social/facebook'
import Patreon from '../svg/icons/patreon'

export const navigation: Array<INav> = [
	{
		href: '/reviews',
		name: 'layout.nav.reviews',
	},
	{
		href: '/resources',
		name: 'layout.nav.resources',
	},
	{
		href: '/about',
		name: 'layout.nav.about',
	},
	{
		href: '/support-us',
		name: 'layout.nav.support-us',
	},
]

export const socialLinks: Array<ILinks> = [
	{
		name: 'Instagram',
		href: 'https://www.instagram.com/ratethelandlord',
		icon: <Instagram />,
	},
	{
		name: 'Twitter',
		href: 'https://twitter.com/r8thelandlord',
		icon: <Twitter />,
	},
	{
		name: 'TikTok',
		href: 'https://www.tiktok.com/@ratethelandlord',
		icon: <TikTok />,
	},
	{
		name: 'Facebook',
		href: 'https://www.facebook.com/profile.php?id=61552287725656',
		icon: <Facebook />,
	},
	{
		name: 'Patreon',
		href: 'https://patreon.com/RateTheLandlord?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=creatorshare_creator&utm_content=join_link',
		icon: <Patreon />,
	},
]
