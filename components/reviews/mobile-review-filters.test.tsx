/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import MobileReviewFilters from './mobile-review-filters'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('MobileReviewFilters', () => {
	const setMobileFiltersOpen = jest.fn()
	const onApply = jest.fn()
	const onClear = jest.fn()
	const onSearchChange = jest.fn()
	const onCityChange = jest.fn()
	const onZipChange = jest.fn()

	const mockProps = {
		mobileFiltersOpen: true,
		setMobileFiltersOpen,
		cityFilter: null,
		zipFilter: null,
		dynamicCityOptions: [],
		dynamicZipOptions: [],
		searchFilter: '',
		onSearchChange,
		onCityChange,
		onZipChange,
		onApply,
		onClear,
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders the component', () => {
		render(<MobileReviewFilters {...mockProps} />)

		expect(screen.getByTestId('mobile-review-filters-1')).toBeInTheDocument()
	})

	it('calls setMobileFiltersOpen when the close button is clicked', () => {
		render(<MobileReviewFilters {...mockProps} />)

		fireEvent.click(screen.getByRole('button', { name: /close menu/i }))

		expect(setMobileFiltersOpen).toHaveBeenCalledWith(false)
	})

	it('calls onApply when Apply Filters is clicked', () => {
		render(<MobileReviewFilters {...mockProps} />)

		fireEvent.click(screen.getByText('reviews.update'))

		expect(onApply).toHaveBeenCalled()
	})

	it('calls onClear when Clear Filters is clicked', () => {
		render(<MobileReviewFilters {...mockProps} />)

		fireEvent.click(screen.getByText('reviews.clear'))

		expect(onClear).toHaveBeenCalled()
	})

	it('has no accessibility violations', async () => {
		const { container } = render(<MobileReviewFilters {...mockProps} />)

		const result = await axe(container)

		expect(result).toHaveNoViolations()
	})
})
