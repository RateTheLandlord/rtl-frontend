/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, fireEvent } from '@/test-utils'
import Button from './button'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Button', () => {
	it('renders button text correctly', () => {
		const buttonText = 'Click me'
		const { getByText } = render(<Button>{buttonText}</Button>)
		const buttonElement = getByText(buttonText)
		expect(buttonElement).toBeInTheDocument()
	})

	it('calls onClick handler when clicked', () => {
		const onClickMock = jest.fn()
		const { getByTestId } = render(
			<Button onClick={onClickMock}>Click me</Button>,
		)
		const buttonElement = getByTestId('submit-button-1')
		fireEvent.click(buttonElement)
		expect(onClickMock).toHaveBeenCalled()
	})

	it('renders with disabled styles when disabled prop is true', () => {
		const { getByTestId } = render(<Button disabled>Click me</Button>)
		const buttonElement = getByTestId('submit-button-1')
		expect(buttonElement).toHaveClass('bg-teal-200')
	})

	it('renders with enabled styles when disabled prop is false', () => {
		const { getByTestId } = render(<Button disabled={false}>Click me</Button>)
		const buttonElement = getByTestId('submit-button-1')
		expect(buttonElement).toHaveClass('bg-teal-600 hover:bg-teal-700')
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<Button>TEST</Button>)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
