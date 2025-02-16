import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from '@headlessui/react'
import { useTranslations } from 'next-intl'
import { toTitleCase } from '@/util/helpers/toTitleCase'
import CatAverages from '../city/CatAverages'
import { ILandlordReviews } from '@/lib/review/types/Queries'

interface IProps {
	name: string
	data: ILandlordReviews
}

const LandlordInfo = ({ name, data }: IProps) => {
	const t = useTranslations('landlord')
	const keys = [
		'tenant-list-1',
		'tenant-list-2',
		'tenant-list-3',
		'tenant-list-4',
	] as const

	const landlord = decodeURIComponent(name)
	return (
		<div className='w-full border-b border-b-gray-200'>
			<div className='rounded-xl bg-gray-50 p-4'>
				<div className='py-8 text-center sm:py-12'>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
						{`${toTitleCase(landlord)}`}
					</h2>
					<p className='mt-2 text-gray-700'>
						{t('rental-experience', {
							total: data.total,
							location: `${toTitleCase(landlord)}`,
						})}
					</p>
				</div>

				<CatAverages
					averages={data.catAverages}
					average={data.average}
					total={data.total}
				/>

				<div className='flex flex-col'>
					<h3 className='mt-4 text-lg text-gray-900'>{t('share')}</h3>
					<p className='mt-1 text-sm text-gray-600'>{t('rented-landlord')}</p>

					<Link className='mt-1' href='/create-review'>
						<p className='mt-2 inline-flex cursor-pointer items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none'>
							{t('submit')}
						</p>
					</Link>
				</div>
			</div>
			<div className='mt-4 divide-gray-900/10 border-t'>
				<Disclosure as='div' className='py-3'>
					{({ open }) => (
						<>
							<DisclosureButton className='flex w-full items-start justify-between text-left text-gray-900'>
								<span className='text-base leading-7'>{t('tenant')}</span>
								<span className='ml-6 flex h-7 items-center'>
									{open ? (
										<MinusSmIcon className='h-6 w-6' aria-hidden='true' />
									) : (
										<PlusSmIcon className='h-6 w-6' aria-hidden='true' />
									)}
								</span>
							</DisclosureButton>
							<DisclosurePanel as='dd' className='mt-2 pr-12 pl-4'>
								<ol className='list-decimal'>
									{keys.map((item, i) => {
										return (
											<li
												key={i}
												className='list-item text-base leading-7 text-gray-600'
											>
												{t(item)}
											</li>
										)
									})}
								</ol>
							</DisclosurePanel>
						</>
					)}
				</Disclosure>
			</div>
		</div>
	)
}

export default LandlordInfo
