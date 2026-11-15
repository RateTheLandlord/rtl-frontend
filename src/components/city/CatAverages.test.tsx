/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import CatAverages from './CatAverages'
expect.extend(toHaveNoViolations)

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
		expect(screen.getByText('landlord.overall')).toBeInTheDocument()
		expect(screen.getByText('landlord.stability')).toBeInTheDocument()
		expect(screen.getByText('landlord.respect')).toBeInTheDocument()
		expect(screen.getByText('landlord.health')).toBeInTheDocument()
		expect(screen.getByText('landlord.privacy')).toBeInTheDocument()
		expect(screen.getByText('landlord.repair')).toBeInTheDocument()

		// Check if RatingStars components exist with correct test IDs
		expect(screen.getByTestId('cataverage')).toBeInTheDocument()
		expect(screen.getByTestId('cataverage-stability')).toBeInTheDocument()
		expect(screen.getByTestId('cataverage-respect')).toBeInTheDocument()
		expect(screen.getByTestId('cataverage-health')).toBeInTheDocument()
		expect(screen.getByTestId('cataverage-privacy')).toBeInTheDocument()
		expect(screen.getByTestId('cataverage-repair')).toBeInTheDocument()

		// Check if the total count text is displayed correctly
		// TODO FIX
		// expect(screen.getByText('Total: 120')).toBeInTheDocument() T
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<CatAverages {...mockProps} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
