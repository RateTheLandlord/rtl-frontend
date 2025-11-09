/**
 * @jest-environment jsdom
 */
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updatePostal, updateRent } from '@/redux/review/reviewSlice'
import { useTranslations } from 'next-intl'
import { Country } from '@/types/review.types'
import LocationForm from './CreateReviewLocationForm'

// ─── Mocks ───────────────────────────────────────────────
jest.mock('@/redux/hooks', () => ({
	useAppDispatch: jest.fn(),
	useAppSelector: jest.fn(),
}))
jest.mock('@/redux/review/reviewSlice', () => ({
	updatePostal: jest.fn((str: string) => ({
		type: 'updatePostal',
		payload: str,
	})),
	updateRent: jest.fn((num: number) => ({ type: 'updateRent', payload: num })),
}))
jest.mock('posthog-js', () => ({
	capture: jest.fn(),
}))
jest.mock('next-intl', () => ({
	useTranslations: jest.fn(),
}))

// Mock all child components to isolate form logic
jest.mock(
	'@/components/ui/button',
	() =>
		(props: {
			onClick: () => void
			disabled: boolean
			children: JSX.Element
		}) => (
			<button onClick={props.onClick} disabled={props.disabled}>
				{props.children}
			</button>
		),
)
jest.mock(
	'@/components/ui/TextInput',
	() =>
		(props: {
			testid: string
			value: string
			placeHolder: string
			setValue: (str: string) => void
		}) => (
			<input
				data-testid={props.testid}
				value={props.value}
				placeholder={props.placeHolder}
				onChange={(e) => props.setValue(e.target.value)}
			/>
		),
)
jest.mock('@/components/ui/StateSelector', () => () => <div>StateSelector</div>)
jest.mock('@/components/ui/CountrySelector', () => () => (
	<div>CountrySelector</div>
))
jest.mock('./CityComboBox', () => () => <div>CityComboBox</div>)

// ─── Test Suite ───────────────────────────────────────────
describe('LocationForm', () => {
	const mockDispatch = jest.fn()
	const mockSetLocationOpen = jest.fn()
	const mockSetShowRatingForm = jest.fn()
	const mockSetRatingsOpen = jest.fn()
	const mockT = jest.fn((key: string, vars?: string[]) => {
		if (key === 'review-form.limit') return `Limit: ${vars?.length || 0}`
		return key
	})

	const baseProps = {
		locationOpen: true,
		postalError: false,
		locations: [],
		searching: false,
		cityValidationError: false,
		cityValidationErrorText: '',
		setShowRatingForm: mockSetShowRatingForm,
		setRatingsOpen: mockSetRatingsOpen,
		setLocationOpen: mockSetLocationOpen,
	}

	beforeEach(() => {
		jest.clearAllMocks()
		;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
		;(useAppSelector as jest.Mock).mockReturnValue({
			country: Country.CA,
			city: 'Toronto',
			province: 'ON',
			postal: 'M5H2N2',
			rent: '1200',
		})
		;(useTranslations as jest.Mock).mockReturnValue(mockT)
	})

	// ─── Collapsed (locationOpen=false) ─────────────────────────────
	it('renders collapsed view when locationOpen is false', () => {
		render(<LocationForm {...baseProps} locationOpen={false} />)

		expect(screen.getByText('location-form.title')).toBeInTheDocument()
		expect(
			screen.getByText('Toronto, ON, CA, M5H2N2 - $1200'),
		).toBeInTheDocument()
		expect(screen.getByText('edit')).toBeInTheDocument()
	})

	it('calls setLocationOpen(true) when edit clicked', () => {
		render(<LocationForm {...baseProps} locationOpen={false} />)

		fireEvent.click(screen.getByText('edit'))
		expect(mockSetLocationOpen).toHaveBeenCalledWith(true)
	})

	// ─── Expanded (locationOpen=true) ─────────────────────────────
	it('renders full location form when open', () => {
		render(<LocationForm {...baseProps} />)
		expect(screen.getByTestId('LocationForm-component')).toBeInTheDocument()
		expect(screen.getByText('CityComboBox')).toBeInTheDocument()
		expect(screen.getByText('StateSelector')).toBeInTheDocument()
		expect(screen.getByText('CountrySelector')).toBeInTheDocument()
	})

	it('dispatches updatePostal when postal input changes', () => {
		render(<LocationForm {...baseProps} />)

		const postalInput = screen.getByTestId('create-review-form-postal-code-1')
		fireEvent.change(postalInput, { target: { value: 'A1A1A1' } })

		expect(mockDispatch).toHaveBeenCalledWith(updatePostal('A1A1A1'))
	})

	it('dispatches updateRent when rent input changes', () => {
		render(<LocationForm {...baseProps} />)

		const rentInput = screen.getByTestId('create-review-form-rent-1')
		fireEvent.change(rentInput, { target: { value: '1500' } })

		expect(mockDispatch).toHaveBeenCalledWith(updateRent(1500))
	})

	it('disables continue button when city or postal are missing', () => {
		;(useAppSelector as jest.Mock).mockReturnValue({
			country: Country.CA,
			city: '',
			province: 'ON',
			postal: '',
			rent: '',
		})

		render(<LocationForm {...baseProps} />)

		const button = screen.getByText('continue')
		expect(button).toBeDisabled()
	})

	it('enables continue button when valid city and postal', () => {
		render(<LocationForm {...baseProps} />)
		const button = screen.getByText('continue')
		expect(button).not.toBeDisabled()
	})

	// ─── Ireland Case ─────────────────────────────
	it('does not render postal input when country is Ireland', () => {
		;(useAppSelector as jest.Mock).mockReturnValue({
			country: Country.IE,
			city: 'Dublin',
			province: '',
			postal: '',
			rent: '',
		})

		render(<LocationForm {...baseProps} />)
		expect(
			screen.queryByTestId('create-review-form-postal-code-1'),
		).not.toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<LocationForm {...baseProps} locationOpen={true} />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
