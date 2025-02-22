/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import CountrySelector from './CountrySelector'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('CountrySelector Component', () => {
	const mockProps = {
		setValue: jest.fn(),
	}

	it('renders CountrySelector component with default values', () => {
		render(<CountrySelector setValue={mockProps.setValue} />)
		const selectElement = screen.getByTestId('country-selector')

		// Ensure that the select element is rendered
		expect(selectElement).toBeInTheDocument()

		// Ensure that it contains options for country codes
		expect(screen.getByText('Canada')).toBeInTheDocument()
		expect(screen.getByText('United States')).toBeInTheDocument()
		// Add more expectations based on your data

		// Simulate a change eventr
		fireEvent.change(selectElement, { target: { value: 'US' } })

		// Ensure that the setValue function is called with the selected value
		expect(mockProps.setValue).toHaveBeenCalledWith('US')
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<CountrySelector setValue={mockProps.setValue} />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
