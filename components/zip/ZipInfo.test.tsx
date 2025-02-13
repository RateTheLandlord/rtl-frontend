/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ZipInfo from './ZipInfo'
import { useTranslation } from 'next-i18next'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next-i18next', () => ({
	useTranslation: jest.fn(),
}))

describe('ZipInfo Component', () => {
	const mockProps = {
		city: 'Test City',
		state: 'Test State',
		country: 'Test Country',
		average: 4.5,
		total: 100,
		averages: {
			avg_repair: 4.0,
			avg_health: 4.2,
			avg_stability: 4.3,
			avg_privacy: 4.1,
			avg_respect: 4.4,
		},
		zip: '12345',
	}

	beforeEach(() => {
		;(useTranslation as jest.Mock).mockReturnValue({
			t: (key: string) => {
				const translations: Record<string, string> = {
					'landlord.rental-experience': `Total: 1, Location: Toronto`,
					'landlord.share': 'Share your experience',
					'landlord.rented-zip': 'Have you rented in this zip code?',
					'landlord.submit': 'Submit a review',
					'landlord.tenant': 'Tenant List',
				}
				return translations[key]
			},
		})
	})

	it('renders the ZipInfo component with correct data', () => {
		render(<ZipInfo {...mockProps} />)

		expect(
			screen.getByText('12345, Test State, TEST COUNTRY'),
		).toBeInTheDocument()
		expect(screen.getByText('Total: 1, Location: Toronto')).toBeInTheDocument()
		expect(screen.getByText('Share your experience')).toBeInTheDocument()
		expect(
			screen.getByText('Have you rented in this zip code?'),
		).toBeInTheDocument()
		expect(screen.getByText('Submit a review')).toBeInTheDocument()
		expect(screen.getByText('Tenant List')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<ZipInfo {...mockProps} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
