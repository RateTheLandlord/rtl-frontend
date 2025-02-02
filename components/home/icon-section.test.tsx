/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import IconSection from './icon-section'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('IconSection', () => {
	test('IconSection renders correctly', () => {
		render(<IconSection />)

		// Ensure the component renders
		const section = screen.getByTestId('home-icon-section-1')
		expect(section).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<IconSection />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
