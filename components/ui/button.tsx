import { classNames } from '@/util/helpers/helper-functions'
import React from 'react'

interface IProps {
	children: string
	disabled?: boolean
	onClick?: () => void
	size?: 'small' | 'medium' | 'large'
}

function Button({
	children,
	disabled = false,
	onClick,
	size = 'small',
}: IProps): JSX.Element {
	return (
		<button
			onClick={onClick}
			type='submit'
			className={classNames(
				'inline-flex justify-center rounded-md border border-transparent text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
				disabled ? 'bg-teal-200' : 'bg-teal-600 hover:bg-teal-700',
				size === 'small' ? 'px-4 py-2 text-sm' : '',
				size === 'medium' ? 'text-2xl' : '',
				size === 'large' ? 'px-8 py-4 text-3xl' : '',
			)}
			disabled={disabled}
			data-testid='submit-button-1'
		>
			{children}
		</button>
	)
}

export default Button
