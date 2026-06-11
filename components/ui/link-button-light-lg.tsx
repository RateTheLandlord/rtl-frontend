import Link from 'next/link'
import React from 'react'

interface IProps {
	children: string | JSX.Element
	href: string
}
export default function LinkButtonLightLG({ children, href }: IProps) {
	return (
		<div
			className='border-primary cursor-pointer rounded-md border bg-white hover:bg-gray-100'
			data-testid='home-hero-read-btn-1'
		>
			<Link href={href}>
				<div className='text-primary w-full px-8 py-3 text-center text-base md:px-10 md:py-4 md:text-lg'>
					{children}
				</div>
			</Link>
		</div>
	)
}
