'use client'

import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'
import posthog from 'posthog-js'
import { usePathname } from '@/i18n/navigation'

const locales = ['en-CA', 'fr-CA'] as const

export default function AppRouterChangeLanguage({
	locale,
}: {
	locale: string
}) {
	const pathname = usePathname()
	const changeLanguage = (newLocale: string) => {
		posthog.capture('language_changed', { locale: newLocale })
		document.cookie = `NEXT_LOCALE=${newLocale}; Path=/; SameSite=Lax`
		const canonicalPath =
			pathname.replace(/^\/(?:en-CA|fr-CA)(?=\/|$)/, '') || '/'
		const destination =
			newLocale === 'fr-CA'
				? `/fr-CA${canonicalPath === '/' ? '' : canonicalPath}`
				: canonicalPath
		window.location.assign(destination)
	}

	return (
		<Listbox value={locale} onChange={changeLanguage}>
			<ListboxButton className='focus-visible:ring-opacity-75 relative flex cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-xs shadow-sm focus:outline-none focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:w-[100px] sm:text-sm md:w-[200px] lg:w-[200px] xl:w-[200px]'>
				{locale === 'en-CA' ? 'English' : 'Français (Canada)'}
				<ChevronDownIcon className='h-4 w-4' />
			</ListboxButton>
			<Transition
				as={Fragment}
				leave='transition ease-in duration-100'
				leaveFrom='opacity-100'
				leaveTo='opacity-0'
			>
				<ListboxOptions
					anchor='bottom'
					className='ring-opacity-5 mt-1 max-h-[250px] w-[200px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm'
				>
					{locales.map((supportedLocale) => (
						<ListboxOption
							key={supportedLocale}
							value={supportedLocale}
							className='cursor-pointer p-2 text-gray-900 select-none hover:bg-teal-300'
						>
							{supportedLocale === 'en-CA' ? 'English' : 'Français (Canada)'}
						</ListboxOption>
					))}
				</ListboxOptions>
			</Transition>
		</Listbox>
	)
}
