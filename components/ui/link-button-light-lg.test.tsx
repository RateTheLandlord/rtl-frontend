/**
 * @jest-environment jsdom
 */
import React from 'react'
import { fireEvent, render } from '@/test-utils'
import LinkButtonLightLG from './link-button-light-lg'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('LinkButtonLightLG', () => {
	it('renders button text correctly', () => {
		const buttonText = 'Click me'
		const { getByText } = render(
			<LinkButtonLightLG href='/'>{buttonText}</LinkButtonLightLG>,
		)
		const buttonElement = getByText(buttonText)
		expect(buttonElement).toBeInTheDocument()
	})

	it('navigates to the correct URL when clicked', () => {
		const href = '/about'
		const { getByTestId } = render(
			<LinkButtonLightLG href={href}>Click Me</LinkButtonLightLG>,
		)
		const buttonElement = getByTestId('home-hero-read-btn-1')
		fireEvent.click(buttonElement)
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<LinkButtonLightLG href='/'>Test</LinkButtonLightLG>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
