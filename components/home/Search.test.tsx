/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import Search from './Search'
import { updateSearch } from '@/redux/query/querySlice'

describe('Search component', () => {
	it('updates search input value correctly', () => {
		render(<Search />)
		const searchInput = screen.getByPlaceholderText('Search for your Landlord')

		fireEvent.change(searchInput, { target: { value: 'New York' } })
		expect(searchInput).toBe('New York')
	})

	it('dispatches search update and navigates on button click', () => {
		const mockDispatch = jest.fn()
		const mockRouterPush = jest.fn()

		jest.mock('@/redux/hooks', () => ({
			useAppDispatch: () => mockDispatch,
		}))
		jest.mock('next/router', () => ({
			useRouter: () => ({ push: mockRouterPush }),
		}))

		render(<Search />)
		const searchButton = screen.getByText('Search')

		fireEvent.click(searchButton)
		expect(mockDispatch).toHaveBeenCalledWith(updateSearch(''))
		expect(mockRouterPush).toHaveBeenCalledWith('/reviews')
	})
})
