/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import '@testing-library/jest-dom'
import ReviewFilters from './review-filters'
import { Options, SortOptions } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

const mockProps = {
	selectedSort: { id: 1, name: 'az', value: 'az' } as SortOptions,
	sortOptions: [
		{ id: 1, name: 'az', value: 'az' },
		{ id: 2, name: 'za', value: 'za' },
	] as SortOptions[],
	setSelectedSort: jest.fn(),
	searchTitle: 'Search Reviews',
	cityFilter: { id: 1, name: 'Los Angeles', value: 'la' },
	zipFilter: { id: 1, name: '90001', value: '90001' },
	dynamicCityOptions: [
		{ id: 1, name: 'Los Angeles', value: 'la' },
	] as Options[],
	dynamicZipOptions: [{ id: 1, name: '90001', value: '90001' }] as Options[],
	searchFilter: '',
	onSearchChange: jest.fn(),
	onCityChange: jest.fn(),
	onZipChange: jest.fn(),
	onApply: jest.fn(),
	onClear: jest.fn(),
}

describe('ReviewFilters Component', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders without crashing', () => {
		render(<ReviewFilters {...mockProps} />)

		expect(screen.getByTestId('review-filters-1')).toBeInTheDocument()
	})

	it('calls onApply when the update button is clicked', () => {
		render(<ReviewFilters {...mockProps} />)

		fireEvent.click(screen.getByTestId('submit-button-1'))

		expect(mockProps.onApply).toHaveBeenCalled()
	})

	it('calls onClear when the clear button is clicked', () => {
		render(<ReviewFilters {...mockProps} />)

		fireEvent.click(screen.getByText('reviews.clear'))

		expect(mockProps.onClear).toHaveBeenCalled()
	})

	it('calls onSearchChange when the search input changes', () => {
		render(<ReviewFilters {...mockProps} />)

		fireEvent.change(screen.getByRole('textbox'), {
			target: { value: 'test search' },
		})

		expect(mockProps.onSearchChange).toHaveBeenCalledWith('test search')
	})

	it('has no accessibility violations', async () => {
		const { container } = render(<ReviewFilters {...mockProps} />)

		const result = await axe(container)

		expect(result).toHaveNoViolations()
	})
})
