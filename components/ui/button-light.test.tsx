/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ButtonLight from './button-light'
import { axe } from 'jest-axe'

describe('ButtonLight', () => {
	it('renders button text correctly', () => {
		const buttonText = 'Click me'
		const { getByText } = render(<ButtonLight>{buttonText}</ButtonLight>)
		const buttonElement = getByText(buttonText)
		expect(buttonElement).toBeInTheDocument()
	})

	it('calls onClick handler when clicked', () => {
		const onClickMock = jest.fn()
		const { getByTestId } = render(
			<ButtonLight onClick={onClickMock}>Click me</ButtonLight>,
		)
		const buttonElement = getByTestId('light-button')
		fireEvent.click(buttonElement)
		expect(onClickMock).toHaveBeenCalled()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<ButtonLight>Click me</ButtonLight>)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
