/**
 * @jest-environment jsdom
 */
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updatePostal } from '@/redux/review/reviewSlice'
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
	const mockT = jest.fn((key: string, vars?: string[]) => {
		if (key === 'review-form.limit') return `Limit: ${vars?.length || 0}`
		return key
	})

	const baseProps = {
		postalError: false,
		locations: [],
		searching: false,
		cityValidationError: false,
		cityValidationErrorText: '',
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

	it('renders the location form fields', () => {
		render(<LocationForm {...baseProps} />)
		expect(screen.getByTestId('LocationForm-component')).toBeInTheDocument()
		expect(screen.getByText('CountrySelector')).toBeInTheDocument()
		expect(screen.getByText('StateSelector')).toBeInTheDocument()
		expect(screen.getByText('CityComboBox')).toBeInTheDocument()
		expect(
			screen.getByTestId('create-review-form-postal-code-1'),
		).toBeInTheDocument()
	})

	it('dispatches updatePostal when postal input changes', () => {
		render(<LocationForm {...baseProps} />)

		const postalInput = screen.getByTestId('create-review-form-postal-code-1')
		fireEvent.change(postalInput, { target: { value: 'A1A1A1' } })

		expect(mockDispatch).toHaveBeenCalledWith(updatePostal('A1A1A1'))
	})

	// ─── Ireland Case ─────────────────────────────
	it('does not render postal input when country is Ireland', () => {
		;(useAppSelector as jest.Mock).mockReturnValue({
			country: Country.IE,
			city: 'Dublin',
			province: '',
			postal: '',
		})

		render(<LocationForm {...baseProps} />)
		expect(
			screen.queryByTestId('create-review-form-postal-code-1'),
		).not.toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<LocationForm {...baseProps} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
