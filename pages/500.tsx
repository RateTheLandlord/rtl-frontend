import LinkButtonLG from '@/components/ui/LinkButtonLg'
import LinkButtonLightLG from '@/components/ui/LinkButtonLightLg'
import { useTranslations } from 'next-intl'

export default function Custom500() {
	const t = useTranslations('layout.error')

	return (
		<main className='mt-2 grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
			<div className='text-center'>
				<p className='text-base text-indigo-600'>500</p>
				<h1 className='mt-4 text-3xl text-gray-900 sm:text-5xl'>
					{t('title')}
				</h1>
				<p className='mt-6 text-base leading-7 text-gray-600'>
					{t('description')}
				</p>
				<div className='mt-10 flex items-center justify-center gap-x-6'>
					<LinkButtonLG href='/'>{t('home')}</LinkButtonLG>
					<LinkButtonLightLG href='mailto:r8thelandlord@gmail.com'>
						{t('contact')}
					</LinkButtonLightLG>
				</div>
			</div>
		</main>
	)
}

export async function getStaticProps({
	locale = 'en-CA',
}: {
	locale?: string
}) {
	const layoutMessages = (await import(
		`@/messages/${locale}/layout.json`
	)) as Record<string, string>
	const alertsMessages = (await import(
		`@/messages/${locale}/alerts.json`
	)) as Record<string, string>
	return {
		props: {
			messages: {
				...layoutMessages,
				...alertsMessages,
			},
		},
	}
}
