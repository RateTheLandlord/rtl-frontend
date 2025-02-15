/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import MobileSelectList from './mobile-select-list'
import { Options } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

const options: Options[] = [
	{ id: 1, value: 'option1', name: 'Option 1' },
	{ id: 2, value: 'option2', name: 'Option 2' },
	{ id: 3, value: 'option3', name: 'Option 3' },
]

describe('MobileSelectList', () => {
	it('renders without crashing', () => {
		render(
			<MobileSelectList
				name='Select an option'
				state={null}
				setState={() => jest.fn()}
				options={options}
			/>,
		)
		expect(screen.getByText('Select an option')).toBeInTheDocument()
	})

	it('displays the selected option', () => {
		const selectedOption = options[1]
		render(
			<MobileSelectList
				name='Select an option'
				state={selectedOption}
				setState={() => jest.fn()}
				options={options}
			/>,
		)
		expect(screen.getByText(selectedOption.name)).toBeInTheDocument()
	})

	it('opens the options list when clicked', () => {
		render(
			<MobileSelectList
				name='Select an option'
				state={null}
				setState={() => jest.fn()}
				options={options}
			/>,
		)
		fireEvent.click(screen.getByRole('button'))
		options.forEach((option) => {
			expect(screen.getByText(option.name)).toBeInTheDocument()
		})
	})

	it('calls setState with the selected option', () => {
		const setState = jest.fn()
		render(
			<MobileSelectList
				name='Select an option'
				state={null}
				setState={setState}
				options={options}
			/>,
		)
		fireEvent.click(screen.getByRole('button'))
		fireEvent.click(screen.getByText(options[0].name))
		expect(setState).toHaveBeenCalledWith(options[0])
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<MobileSelectList
				name='Select an option'
				state={null}
				setState={() => jest.fn()}
				options={options}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
