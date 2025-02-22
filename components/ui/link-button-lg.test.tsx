/**
 * @jest-environment jsdom
 */
import React from 'react'
import { fireEvent, render } from '@/test-utils'
import LinkButtonLG from './link-button-lg'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('LinkButtonLG', () => {
	it('renders button text correctly', () => {
		const buttonText = 'Click me'
		const { getByText } = render(
			<LinkButtonLG href='/'>{buttonText}</LinkButtonLG>,
		)
		const buttonElement = getByText(buttonText)
		expect(buttonElement).toBeInTheDocument()
	})

	it('navigates to the correct URL when clicked', () => {
		const href = '/about'
		const { getByTestId } = render(
			<LinkButtonLG href={href}>Click Me</LinkButtonLG>,
		)
		const buttonElement = getByTestId('home-hero-submit-btn-1')
		fireEvent.click(buttonElement)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<LinkButtonLG href='/'>Test</LinkButtonLG>)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
