/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ActiveFilters from './active-filters'
import { Options } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('ActiveFilters component', () => {
	const mockRemoveFilter = jest.fn()
	const activeFilter: Options = { id: 1, value: 'test', name: 'Test Filter' }
	const index = 0

	test('renders the active filter name', () => {
		render(
			<ActiveFilters
				activeFilter={activeFilter}
				removeFilter={mockRemoveFilter}
				index={index}
			/>,
		)
		expect(screen.getByText('Test Filter')).toBeInTheDocument()
	})

	test('calls removeFilter when the button is clicked', () => {
		render(
			<ActiveFilters
				activeFilter={activeFilter}
				removeFilter={mockRemoveFilter}
				index={index}
			/>,
		)
		const button = screen.getByRole('button', {
			name: /Remove filter for Test Filter/i,
		})
		fireEvent.click(button)
		expect(mockRemoveFilter).toHaveBeenCalledWith(index)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<ActiveFilters
				activeFilter={activeFilter}
				removeFilter={mockRemoveFilter}
				index={index}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
