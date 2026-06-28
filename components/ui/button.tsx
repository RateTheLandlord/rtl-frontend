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
			aria-label='Submit Button'
			onClick={onClick}
			type='submit'
			className={classNames(
				'focus:ring-primary inline-flex cursor-pointer justify-center rounded-md border border-transparent text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none',
				disabled ? 'bg-primary/20' : 'bg-primary hover:bg-primary-hover',
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
