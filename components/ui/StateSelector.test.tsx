/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import StateSelector from './StateSelector'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('StateSelector Component', () => {
	const mockProps = {
		country: 'CA', // Replace with your desired country code
		setValue: jest.fn(),
	}

	test('renders StateSelector component for Canada', () => {
		render(
			<StateSelector
				country={mockProps.country}
				setValue={mockProps.setValue}
				value=''
			/>,
		)
		const selectElement = screen.getByTestId('state-selector')

		// Ensure that the select element is rendered
		expect(selectElement).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<StateSelector
				country={mockProps.country}
				setValue={mockProps.setValue}
				value=''
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
