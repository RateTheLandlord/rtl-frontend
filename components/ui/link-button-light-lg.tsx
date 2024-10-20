import Link from 'next/link'
import React from 'react'

interface IProps {
	children: string | JSX.Element
	href: string
}
export default function LinkButtonLightLG({ children, href }: IProps) {
	return (
		<div
			className='cursor-pointer rounded-md border border-teal-600 bg-white hover:bg-gray-100'
			data-testid='home-hero-read-btn-1'
		>
			<Link href={href}>
				<div className='w-full px-8 py-3 text-center text-base  text-teal-600 md:px-10 md:py-4 md:text-lg'>
					{children}
				</div>
			</Link>
		</div>
	)
}
