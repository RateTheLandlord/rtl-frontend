/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SelectList from './locationSelect-list'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

const options = [
	{ id: 1, value: 'option1', name: 'Option 1' },
	{ id: 2, value: 'option2', name: 'Option 2' },
	{ id: 3, value: 'option3', name: 'Option 3' },
]

describe('SelectList Component', () => {
	let setState: jest.Mock

	beforeEach(() => {
		setState = jest.fn()
	})

	test('renders without crashing', () => {
		render(
			<SelectList
				name='Select an option'
				state={null}
				setState={setState}
				options={options}
			/>,
		)
		expect(screen.getByText('Select an option')).toBeInTheDocument()
	})

	test('displays options when clicked', () => {
		render(
			<SelectList
				name='Select an option'
				state={null}
				setState={setState}
				options={options}
			/>,
		)
		fireEvent.click(screen.getByRole('button'))
		options.forEach((option) => {
			expect(screen.getByText(option.name)).toBeInTheDocument()
		})
	})

	test('calls setState with the selected option', () => {
		render(
			<SelectList
				name='Select an option'
				state={null}
				setState={setState}
				options={options}
			/>,
		)
		fireEvent.click(screen.getByRole('button'))
		fireEvent.click(screen.getByText('Option 2'))
		expect(setState).toHaveBeenCalledWith(options[1])
	})

	test('displays the selected option', () => {
		render(
			<SelectList
				name='Select an option'
				state={options[1]}
				setState={setState}
				options={options}
			/>,
		)
		expect(screen.getByText('Option 2')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<SelectList
				name='Select an option'
				state={null}
				setState={setState}
				options={options}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
