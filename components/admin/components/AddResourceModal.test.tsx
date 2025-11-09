/**
 * @jest-environment jsdom
 */
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddResourceModal from './AddResourceModal'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useLocation } from '@/util/hooks/useLocation'
import { updateState } from '@/redux/resource/resourceSlice'
import { Country } from '@/types/review.types'

// Mock hooks and actions
jest.mock('@/redux/hooks', () => ({
	useAppSelector: jest.fn(),
	useAppDispatch: jest.fn(),
}))

jest.mock('@/util/hooks/useLocation', () => ({
	useLocation: jest.fn(),
}))

jest.mock('@/redux/resource/resourceSlice', () => ({
	updateAddress: jest.fn(() => ({ type: 'updateAddress' })),
	updateDescription: jest.fn(() => ({ type: 'updateDescription' })),
	updateHref: jest.fn(() => ({ type: 'updateHref' })),
	updateName: jest.fn(() => ({ type: 'updateName' })),
	updatePhone: jest.fn(() => ({ type: 'updatePhone' })),
	updateState: jest.fn((payload: string) => ({ type: 'updateState', payload })),
}))

// Mock child components (keep them minimal)
jest.mock('@/components/create-review/components/CityComboBox', () => () => (
	<div data-testid='city-combobox'>CityComboBox</div>
))
jest.mock(
	'@/components/ui/TextInput',
	() => (props: { id: string; placeHolder: string; value: string }) => (
		<input
			data-testid={props.id}
			placeholder={props.placeHolder}
			value={props.value}
		/>
	),
)
jest.mock(
	'@/components/ui/LargeTextInput',
	() => (props: { id: string; value: string }) => (
		<textarea
			data-testid={props.id}
			aria-label={props.id}
			value={props.value}
		/>
	),
)
jest.mock('@/components/ui/CountrySelector', () => () => (
	<div data-testid='country-selector'>CountrySelector</div>
))
jest.mock('@/components/ui/StateSelector', () => () => (
	<div data-testid='state-selector'>StateSelector</div>
))

describe('AddResourceModal', () => {
	const mockDispatch = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
		;(useLocation as jest.Mock).mockReturnValue({
			searching: false,
			locations: [{ id: 1, city: 'Toronto' }],
		})
		;(useAppSelector as jest.Mock).mockReturnValue({
			name: 'Test Name',
			country_code: Country.CA,
			city: 'Toronto',
			address: '123 Street',
			phone_number: '1234567890',
			description: 'A test resource',
			href: 'https://example.com',
		})
	})

	it('renders the form and key input fields', () => {
		render(<AddResourceModal />)

		expect(screen.getByTestId('add-user-modal-1')).toBeInTheDocument()
		expect(screen.getByTestId('name')).toHaveValue('Test Name')
		expect(screen.getByTestId('address')).toHaveValue('123 Street')
		expect(screen.getByTestId('phone')).toHaveValue('1234567890')
		expect(screen.getByTestId('href')).toHaveValue('https://example.com')
		expect(screen.getByTestId('description')).toHaveValue('A test resource')
		expect(screen.getByTestId('city-combobox')).toBeInTheDocument()
		expect(screen.getByTestId('country-selector')).toBeInTheDocument()
		expect(screen.getByTestId('state-selector')).toBeInTheDocument()
	})

	it('dispatches correct state updates based on country_code', () => {
		const { rerender } = render(<AddResourceModal />)

		// Default (CA → Alberta)
		expect(mockDispatch).toHaveBeenCalledWith(updateState('Alberta'))

		// Change country_code and rerender
		;(useAppSelector as jest.Mock).mockReturnValueOnce({
			...useAppSelector(),
			country_code: Country.GB,
		})
		rerender(<AddResourceModal />)
		expect(mockDispatch).toHaveBeenCalledWith(updateState('England'))
		;(useAppSelector as jest.Mock).mockReturnValueOnce({
			...useAppSelector(),
			country_code: Country.AU,
		})
		rerender(<AddResourceModal />)
		expect(mockDispatch).toHaveBeenCalledWith(updateState('Northern Territory'))
		;(useAppSelector as jest.Mock).mockReturnValueOnce({
			...useAppSelector(),
			country_code: Country.US,
		})
		rerender(<AddResourceModal />)
		expect(mockDispatch).toHaveBeenCalledWith(updateState('Alabama'))
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<AddResourceModal />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
