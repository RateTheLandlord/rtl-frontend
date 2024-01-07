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
		umami: 'Navbar / Reviews Link',
		mobileumami: 'Mobile Navbar / Reviews Link',
	},
	{
		href: '/resources',
		name: 'layout.nav.resources',
		umami: 'Navbar / Resources link',
		mobileumami: 'Mobile Navbar / Resources Link',
	},
	{
		href: '/about',
		name: 'layout.nav.about',
		umami: 'Navbar / About Link',
		mobileumami: 'Mobile Navbar / About Link',
	},
	{
		href: '/support-us',
		name: 'layout.nav.support-us',
		umami: 'Navbar / Support Us Link',
		mobileumami: 'Mobile Navbar / Support Us Link',
	},
]

export const socialLinks: Array<ILinks> = [
	{
		name: 'Instagram',
		href: 'https://www.instagram.com/ratethelandlord',
		icon: <Instagram />,
		umami: 'Instagram Icon',
	},
	{
		name: 'Twitter',
		href: 'https://twitter.com/r8thelandlord',
		icon: <Twitter />,
		umami: 'Twitter Icon',
	},
	{
		name: 'TikTok',
		href: 'https://www.tiktok.com/@ratethelandlord',
		icon: <TikTok />,
		umami: 'TikTok Icon',
	},
	{
		name: 'Facebook',
		href: 'https://www.facebook.com/profile.php?id=61552287725656',
		icon: <Facebook />,
		umami: 'Facebook Icon',
	},
	{
		name: 'Patreon',
		href: 'https://patreon.com/RateTheLandlord?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=creatorshare_creator&utm_content=join_link',
		icon: <Patreon />,
		umami: 'Patreon Icon',
	},
]
