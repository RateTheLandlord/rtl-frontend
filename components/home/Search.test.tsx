/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import Search from './Search'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

jest.mock('next/router', () => jest.requireActual('next-router-mock'))

describe('Search component', () => {
	it('updates search input value correctly', () => {
		render(
			<Provider store={store}>
				<Search />
			</Provider>,
		)
		const searchInput = screen.getByPlaceholderText('Search for your Landlord')

		fireEvent.change(searchInput, { target: { value: 'New York' } })
		expect(screen.getByText('"New York"')).toBeInTheDocument()
	})
})
