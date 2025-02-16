/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import SortList from './sort-list'
import { SortOptions } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

const mockOptions: SortOptions[] = [
	{ id: 1, name: 'option1', value: 'az' },
	{ id: 2, name: 'option2', value: 'za' },
	{ id: 3, name: 'option3', value: 'high' },
]

describe('SortList', () => {
	it('renders correctly with given props', () => {
		const mockSetState = jest.fn()
		render(
			<SortList
				state={mockOptions[0]}
				setState={mockSetState}
				options={mockOptions}
				name='Sort by'
			/>,
		)

		expect(screen.getByTestId('sort-list-test')).toBeInTheDocument()
	})

	it('calls setState when an option is selected', () => {
		const mockSetState = jest.fn()
		render(
			<SortList
				state={mockOptions[0]}
				setState={mockSetState}
				options={mockOptions}
				name='Sort by'
			/>,
		)

		fireEvent.click(screen.getByLabelText('Select Sort'))
		fireEvent.click(screen.getByText('filters.option2'))

		expect(mockSetState).toHaveBeenCalledWith(mockOptions[1])
	})

	it('displays the correct option as selected', () => {
		const mockSetState = jest.fn()
		render(
			<SortList
				state={mockOptions[1]}
				setState={mockSetState}
				options={mockOptions}
				name='Sort by'
			/>,
		)

		expect(screen.getByText('filters.option2')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<SortList
				state={mockOptions[0]}
				setState={() => jest.fn()}
				options={mockOptions}
				name='Sort by'
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
