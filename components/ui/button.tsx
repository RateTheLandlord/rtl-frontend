import React from 'react'

interface IProps {
	children: string
	disabled?: boolean
	onClick?: () => void
	umami: string
}

function Button({
	children,
	disabled = false,
	onClick,
	umami,
}: IProps): JSX.Element {
	return (
		<button
			data-umami-event={umami}
			onClick={onClick}
			type='submit'
			className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm  text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
				disabled ? 'bg-teal-200' : 'bg-teal-600 hover:bg-teal-700'
			}`}
			disabled={disabled}
			data-testid='submit-button-1'
		>
			{children}
		</button>
	)
}

export default Button
