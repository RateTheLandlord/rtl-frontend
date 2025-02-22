/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import ComboBox from './combobox'
import { Options } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

const options: Options[] = [
	{ id: 1, value: 'Option 1', name: 'Option 1' },
	{ id: 2, value: 'Option 2', name: 'Option 2' },
	{ id: 3, value: 'Option 3', name: 'Option 3' },
]

describe('ComboBox', () => {
	let state: Options | null
	let setState: jest.Mock

	beforeEach(() => {
		state = null
		setState = jest.fn()
	})

	it('renders ComboBox with placeholder', () => {
		render(
			<ComboBox
				state={state}
				setState={setState}
				options={options}
				name='Select an option'
			/>,
		)
		expect(screen.getByPlaceholderText('Select an option')).toBeInTheDocument()
	})

	it('displays "Nothing found" when no options match query', () => {
		render(
			<ComboBox
				state={state}
				setState={setState}
				options={options}
				name='Select an option'
			/>,
		)
		const input = screen.getByPlaceholderText('Select an option')
		fireEvent.change(input, { target: { value: 'Non-existent option' } })
		expect(screen.getByText('Nothing found.')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<ComboBox
				state={state}
				setState={setState}
				options={options}
				name='Select an option'
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
