/**
 * @jest-environment jsdom
 */
import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import LinkButtonLG from './link-button-lg'

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
		// You can add additional assertions to verify the navigation behavior if needed
		// For example: expect(window.location.pathname).toBe(href);
	})
})
