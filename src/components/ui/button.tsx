import { classNames } from '@/util/helpers/helper-functions'
import { type JSX } from 'react'

interface IProps {
	children: string
	disabled?: boolean
	onClick?: () => void
	size?: 'small' | 'medium' | 'large'
	label?: string
	testid?: string
}

function Button({
	children,
	disabled = false,
	onClick,
	size = 'small',
	label = 'Submit Button',
	testid = 'submit-button-1',
}: IProps): JSX.Element {
	return (
		<button
			aria-label={label}
			onClick={onClick}
			type='submit'
			className={classNames(
				'focus:ring-primary inline-flex justify-center rounded-md border border-transparent shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none',
				disabled
					? 'bg-primary/5 text-primary cursor-not-allowed'
					: 'bg-primary hover:bg-primary-hover cursor-pointer text-white',
				size === 'small' ? 'px-4 py-2 text-sm' : '',
				size === 'medium' ? 'text-2xl' : '',
				size === 'large' ? 'px-8 py-4 text-3xl' : '',
			)}
			disabled={disabled}
			data-testid={testid}
		>
			{children}
		</button>
	)
}

export default Button
