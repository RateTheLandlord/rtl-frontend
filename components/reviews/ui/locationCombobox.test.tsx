/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ComboBox from './locationCombobox'
import { Options } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

const options: Options[] = [
	{ id: 1, value: 'newyork', name: 'New York' },
	{ id: 2, value: 'la', name: 'Los Angeles' },
	{ id: 3, value: 'chi', name: 'Chicago' },
	{ id: 4, value: 'houston', name: 'Houston' },
	{ id: 5, value: 'phoenix', name: 'Phoenix' },
]

describe('ComboBox', () => {
	it('renders without crashing', () => {
		render(
			<ComboBox
				state={null}
				setState={() => jest.fn()}
				options={options}
				name='Location'
			/>,
		)
		expect(screen.getByPlaceholderText('Search Location')).toBeInTheDocument()
	})

	it('displays "Nothing found" when no options match the query', () => {
		render(
			<ComboBox
				state={null}
				setState={() => jest.fn()}
				options={options}
				name='Location'
			/>,
		)
		const input = screen.getByPlaceholderText('Search Location')
		fireEvent.change(input, { target: { value: 'Nonexistent' } })
		expect(screen.getByText('Nothing found.')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<ComboBox
				state={null}
				setState={() => jest.fn()}
				options={options}
				name='Location'
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
