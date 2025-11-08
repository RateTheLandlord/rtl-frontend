/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateCity } from '@/redux/review/reviewSlice'
import CityComboBox from './CityComboBox'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

// Mock Redux hooks
jest.mock('@/redux/hooks', () => ({
	useAppDispatch: jest.fn(),
	useAppSelector: jest.fn(),
}))

jest.mock('@/redux/review/reviewSlice', () => ({
	updateCity: jest.fn((city: string) => ({
		type: 'updateCity',
		payload: city,
	})),
}))

describe('CityComboBox', () => {
	const mockDispatch = jest.fn()
	const baseProps = {
		name: 'City',
		options: [
			{ id: 1, city: 'Toronto', state: 'ON', country: 'CA' },
			{ id: 2, city: 'Ottawa', state: 'ON', country: 'CA' },
		],
		searching: false,
		error: false,
		errorText: '',
	}

	beforeEach(() => {
		jest.clearAllMocks()
		;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
		;(useAppSelector as jest.Mock).mockReturnValue({
			city: '',
			state: 'ON',
		})
	})

	it('renders correctly with label and input', () => {
		render(<CityComboBox {...baseProps} />)

		expect(screen.getByText('City')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('City')).toBeInTheDocument()
	})

	it('dispatches updateCity when typing in the input', () => {
		render(<CityComboBox {...baseProps} />)

		const input = screen.getByTestId('CityComboBox-component')
		fireEvent.change(input, { target: { value: 'Tor' } })

		expect(mockDispatch).toHaveBeenCalledWith(updateCity('Tor'))
	})

	it('shows loading message when searching and no options', () => {
		;(useAppSelector as jest.Mock).mockReturnValue({
			city: '',
			province: 'ON',
		})

		render(<CityComboBox {...baseProps} options={[]} searching={true} />)

		expect(screen.getByText('Loading...')).toBeInTheDocument()
	})

	it('shows "City Not Found" when no results and not searching', () => {
		render(<CityComboBox {...baseProps} options={[]} searching={false} />)

		expect(screen.getByText('City Not Found')).toBeInTheDocument()
	})

	it('renders all city options', () => {
		render(<CityComboBox {...baseProps} />)

		expect(screen.getByText('Toronto')).toBeInTheDocument()
		expect(screen.getByText('Ottawa')).toBeInTheDocument()
	})

	it('dispatches updateCity when selecting a city option', async () => {
		render(<CityComboBox {...baseProps} />)

		const option = screen.getByText('Toronto')
		fireEvent.click(option)

		await waitFor(() => {
			expect(mockDispatch).toHaveBeenCalledWith(updateCity('Toronto'))
		})
	})

	it('shows error text when error is true', () => {
		render(
			<CityComboBox {...baseProps} error={true} errorText='City is required' />,
		)

		expect(screen.getByText('City is required')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<CityComboBox
				name='City'
				options={[]}
				searching={true}
				error={false}
				errorText=''
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
