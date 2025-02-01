/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import CatAverages from './CatAverages'
expect.extend(toHaveNoViolations)

jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, params?: Record<string, any>) => {
			const translations: Record<string, string> = {
				'landlord.overall': 'Overall',
				'landlord.stability': 'Stability',
				'landlord.respect': 'Respect',
				'landlord.health': 'Health',
				'landlord.privacy': 'Privacy',
				'landlord.repair': 'Repair',
				'landlord.total': `Total: ${params?.total || 0}`,
				'landlord.average': `Average: ${params?.average || 0}`,
			}
			return translations[key] || key
		},
	}),
}))

describe('CatAverages Component', () => {
	const mockProps = {
		averages: {
			avg_repair: 3.5,
			avg_health: 4.0,
			avg_stability: 2.5,
			avg_privacy: 3.0,
			avg_respect: 4.5,
		},
		average: 3.5,
		total: 120,
	}

	test('renders correctly with provided data', () => {
		render(<CatAverages {...mockProps} />)

		// Check if all categories are present
		expect(screen.getByText('Overall')).toBeInTheDocument()
		expect(screen.getByText('Stability')).toBeInTheDocument()
		expect(screen.getByText('Respect')).toBeInTheDocument()
		expect(screen.getByText('Health')).toBeInTheDocument()
		expect(screen.getByText('Privacy')).toBeInTheDocument()
		expect(screen.getByText('Repair')).toBeInTheDocument()

		// Check if RatingStars components exist with correct test IDs
		expect(screen.getByTestId('cataverage')).toBeInTheDocument()
		expect(screen.getByTestId('cataverage-stability')).toBeInTheDocument()
		expect(screen.getByTestId('cataverage-respect')).toBeInTheDocument()
		expect(screen.getByTestId('cataverage-health')).toBeInTheDocument()
		expect(screen.getByTestId('cataverage-privacy')).toBeInTheDocument()
		expect(screen.getByTestId('cataverage-repair')).toBeInTheDocument()

		// Check if the total count text is displayed correctly
		expect(screen.getByText('Total: 120')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<CatAverages {...mockProps} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
