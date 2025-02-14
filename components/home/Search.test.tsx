/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { updateSearch } from '@/redux/query/querySlice'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'
import Search from './Search'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

jest.mock('next-i18next', () => ({
	useTranslation: jest.fn(),
}))

jest.mock('@/redux/hooks', () => ({
	useAppDispatch: jest.fn(),
}))

jest.mock('@/util/hooks/useLandlordSuggestions', () => ({
	useLandlordSuggestions: jest.fn(),
}))

describe('Search', () => {
	const mockPush = jest.fn()
	const mockDispatch = jest.fn()
	const mockUseTranslation = jest.fn().mockReturnValue({
		t: (key) => key,
	})
	const mockUseLandlordSuggestions = jest.fn().mockReturnValue({
		isSearching: false,
		landlordSuggestions: [],
	})

	beforeEach(() => {
		;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
		;(useTranslation as jest.Mock).mockImplementation(mockUseTranslation)
		;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
		;(useLandlordSuggestions as jest.Mock).mockImplementation(
			mockUseLandlordSuggestions,
		)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('renders the search input', () => {
		render(<Search />)
		expect(
			screen.getByPlaceholderText('filters.search-placeholder'),
		).toBeInTheDocument()
	})

	it('updates search state on input change', () => {
		render(<Search />)
		const input = screen.getByPlaceholderText('filters.search-placeholder')
		fireEvent.change(input, { target: { value: 'test' } })
		expect(input).toHaveValue('test')
	})

	it('dispatches updateSearch and navigates on selection', () => {
		render(<Search />)
		const input = screen.getByPlaceholderText('filters.search-placeholder')
		fireEvent.change(input, { target: { value: 'test' } })
		fireEvent.blur(input)
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
		waitFor(() => {
			expect(mockDispatch).toHaveBeenCalledWith(updateSearch('test'))
			expect(mockPush).toHaveBeenCalledWith('/landlord/test')
		})
	})

	it('shows not found message when no suggestions', () => {
		render(<Search />)
		const input = screen.getByPlaceholderText('filters.search-placeholder')
		fireEvent.change(input, { target: { value: 'test' } })
		expect(screen.getByText('filters.not-found')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<Search />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
