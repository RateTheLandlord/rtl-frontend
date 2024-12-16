import { useRouter } from 'next/router'
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition,
} from '@headlessui/react'
import { changeLanguage as CL } from 'i18next'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'

const ChangeLanguage = () => {
	const router = useRouter()
	const { locale, locales, asPath } = router // Extract current locale, available locales, and path

	const changeLanguage = (newLocale) => {
		router.push(asPath, asPath, { locale: newLocale }) // Change locale using Next.js routing
		CL(newLocale)
	}

	return (
		<Listbox value={locale} onChange={changeLanguage}>
			<ListboxButton className='relative flex xl:w-[200px] lg:w-[200px] md:w-[200px] sm:w-[100px] cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left shadow-sm focus:outline-none focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
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
					className='mt-1 max-h-[250px] w-[200px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
				>
					{locales?.map((lang) => (
						<ListboxOption
							key={lang}
							value={lang}
							className={`cursor-pointer select-none p-2 text-gray-900 hover:bg-teal-300`}
						>
							{lang === 'en-CA' ? 'English' : 'Français (Canada)'}
						</ListboxOption>
					))}
				</ListboxOptions>
			</Transition>
		</Listbox>
	)
}

export default ChangeLanguage
