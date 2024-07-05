import Link from 'next/link'
import React from 'react'

interface IProps {
	children: string
	href: string
}
export default function LinkButtonLG({ children, href }: IProps) {
	return (
		<div
			className='cursor-pointer rounded-md border border-teal-600 bg-teal-600 hover:bg-teal-500'
			data-testid='home-hero-submit-btn-1'
		>
			<Link href={href}>
				<p className='px-8 py-3 text-base  text-white md:px-10 md:py-4 md:text-lg'>
					{children}
				</p>
			</Link>
		</div>
	)
}
