/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import SearchBar from './searchbar'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('SearchBar', () => {
	const setSearchState = jest.fn()

	it('renders the search input with placeholder', () => {
		render(<SearchBar setSearchState={setSearchState} />)
		const input = screen.getByRole('textbox')
		expect(input).toBeInTheDocument()
		expect(input).toHaveAttribute(
			'placeholder',
			'filters.search filters.landlord',
		)
	})

	it('calls setSearchState on input change', () => {
		render(<SearchBar setSearchState={setSearchState} />)
		const input = screen.getByRole('textbox')
		fireEvent.change(input, { target: { value: 'test' } })
		expect(setSearchState).toHaveBeenCalledWith('test')
	})

	it('renders the clear button when input has value', () => {
		render(<SearchBar setSearchState={setSearchState} value='test' />)
		const button = screen.getByRole('button')
		expect(button).toBeInTheDocument()
	})

	it('calls setSearchState with empty string when clear button is clicked', () => {
		render(<SearchBar setSearchState={setSearchState} value='test' />)
		const button = screen.getByRole('button')
		fireEvent.click(button)
		expect(setSearchState).toHaveBeenCalledWith('')
	})

	it('does not render the clear button when input is empty', () => {
		render(<SearchBar setSearchState={setSearchState} value='' />)
		const button = screen.queryByRole('button')
		expect(button).not.toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<SearchBar setSearchState={setSearchState} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
