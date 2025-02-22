/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import CloseButton from './CloseButton'
import { axe } from 'jest-axe'

describe('CloseButton', () => {
	it('renders CloseButton component', () => {
		render(<CloseButton onClick={() => {}} />)
		expect(screen.getByText('Close')).toBeInTheDocument()
	})

	it('calls onClick when button is clicked', () => {
		const handleClick = jest.fn()
		render(<CloseButton onClick={handleClick} />)
		const button = screen.getByRole('button')
		fireEvent.click(button)
		expect(handleClick).toHaveBeenCalledTimes(1)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<CloseButton onClick={() => {}} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
