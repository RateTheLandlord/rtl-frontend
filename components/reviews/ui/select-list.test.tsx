/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SelectList from './select-list'
import { Options } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('SelectList Component', () => {
	const options: Options[] = [
		{ id: 1, name: 'Option 1', value: 'Option 1' },
		{ id: 2, name: 'Option 2', value: 'Option 2' },
		{ id: 3, name: 'Option 3', value: 'Option 3' },
	]

	const setState = jest.fn()

	it('renders without crashing', () => {
		render(
			<SelectList
				state={null}
				setState={setState}
				options={options}
				name='Select an option'
			/>,
		)
		expect(screen.getByText('Select an option')).toBeInTheDocument()
	})

	it('displays the correct initial state', () => {
		render(
			<SelectList
				state={options[0]}
				setState={setState}
				options={options}
				name='Select an option'
			/>,
		)
		expect(screen.getByText('Option 1')).toBeInTheDocument()
	})

	it('opens the options list when clicked', () => {
		render(
			<SelectList
				state={null}
				setState={setState}
				options={options}
				name='Select an option'
			/>,
		)
		fireEvent.click(screen.getByRole('button'))
		expect(screen.getByText('Option 1')).toBeInTheDocument()
		expect(screen.getByText('Option 2')).toBeInTheDocument()
		expect(screen.getByText('Option 3')).toBeInTheDocument()
	})

	it('calls setState with the correct option when an option is selected', () => {
		render(
			<SelectList
				state={null}
				setState={setState}
				options={options}
				name='Select an option'
			/>,
		)
		fireEvent.click(screen.getByRole('button'))
		fireEvent.click(screen.getByText('Option 2'))
		expect(setState).toHaveBeenCalledWith(options[1])
	})

	it('displays the selected option correctly', () => {
		render(
			<SelectList
				state={options[1]}
				setState={setState}
				options={options}
				name='Select an option'
			/>,
		)
		expect(screen.getByText('Option 2')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<SelectList
				state={null}
				setState={setState}
				options={options}
				name='Select an option'
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
