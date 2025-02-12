/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import StatsDropdown from './StatsDropdown'
import { axe } from 'jest-axe'
import { Options } from '@/util/interfaces/interfaces'

const options: Options[] = [
	{ id: 1, value: 'option1', name: 'Option 1' },
	{ id: 2, value: 'option2', name: 'Option 2' },
	{ id: 3, value: 'option4', name: 'Option 3' },
]

const setSelected = jest.fn()

describe('StatsDropdown', () => {
	it('renders correctly with given options', () => {
		render(
			<StatsDropdown
				options={options}
				selected={options[0]}
				setSelected={setSelected}
			/>,
		)
		expect(screen.getByText('Option 1')).toBeInTheDocument()
	})

	it('opens the dropdown when clicked', () => {
		render(
			<StatsDropdown
				options={options}
				selected={options[0]}
				setSelected={setSelected}
			/>,
		)
		fireEvent.click(screen.getByRole('button'))
		expect(screen.getByText('Option 2')).toBeInTheDocument()
		expect(screen.getByText('Option 3')).toBeInTheDocument()
	})

	it('calls setSelected when an option is selected', () => {
		render(
			<StatsDropdown
				options={options}
				selected={options[0]}
				setSelected={setSelected}
			/>,
		)
		fireEvent.click(screen.getByRole('button'))
		fireEvent.click(screen.getByText('Option 2'))
		expect(setSelected).toHaveBeenCalledWith(options[1])
	})

	it('displays the selected option correctly', () => {
		render(
			<StatsDropdown
				options={options}
				selected={options[1]}
				setSelected={setSelected}
			/>,
		)
		expect(screen.getByText('Option 2')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<StatsDropdown
				options={options}
				selected={options[0]}
				setSelected={setSelected}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
