import React, { type JSX } from 'react'

interface IProps {
	children: string | JSX.Element
	onClick?: () => void
	label?: string
	type?: 'reset' | 'submit' | 'button' | undefined
	testid?: string
}
function ButtonLight({
	children,
	onClick,
	label = 'Reset Button',
	type = 'reset',
	testid = 'light-button',
}: IProps): JSX.Element {
	return (
		<button
			type={type}
			aria-label={label}
			onClick={onClick}
			className='cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none'
			data-testid={testid}
		>
			{children}
		</button>
	)
}

export default ButtonLight
