/**
 * @jest-environment jsdom
 */
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
import { render, screen, fireEvent } from '@testing-library/react'
import CountrySelector from '@/components/ui/CountrySelector'
import { useAppDispatch } from '@/redux/hooks'
import { updateCountry } from '@/redux/review/reviewSlice'
import { Country } from '@/types/review.types'

// Mock hooks and translation
jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}))

jest.mock('@/redux/hooks', () => ({
	useAppDispatch: jest.fn(),
	useAppSelector: jest.fn(),
}))

// Mock countries JSON
jest.mock('@/util/countries/countries.json', () => ({
	CA: 'Canada',
	US: 'United States',
	IE: 'Ireland',
}))

describe('CountrySelector', () => {
	const mockDispatch = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
	})

	it('renders the country selector and label', () => {
		render(<CountrySelector />)

		// Label is rendered
		expect(screen.getByText('review-form.country')).toBeInTheDocument()

		// Select input is rendered
		const select = screen.getByTestId('country-selector')
		expect(select).toBeInTheDocument()

		// Options render correctly
		expect(screen.getByText('Canada')).toBeInTheDocument()
		expect(screen.getByText('United States')).toBeInTheDocument()
		expect(screen.getByText('Ireland')).toBeInTheDocument()
	})

	it('dispatches updateCountry with the correct payload on change', () => {
		render(<CountrySelector />)

		const select = screen.getByTestId('country-selector')
		fireEvent.change(select, { target: { value: 'CA' } })

		expect(mockDispatch).toHaveBeenCalledTimes(1)
		expect(mockDispatch).toHaveBeenCalledWith(updateCountry(Country.CA))
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<CountrySelector />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
