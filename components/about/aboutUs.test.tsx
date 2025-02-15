/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import AboutUs from './aboutUs'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

test('renders about section with info items', () => {
	render(<AboutUs />)
	const aboutSection = screen.getByTestId('about-aboutus-1')
	expect(aboutSection).toBeInTheDocument()

	expect(screen.getByText('About Us')).toBeInTheDocument()
})

it('Should not have a11y violation', async () => {
	const { container } = render(<AboutUs />)
	const result = await axe(container)
	expect(result).toHaveNoViolations()
})
