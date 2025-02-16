/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import '@testing-library/jest-dom'
import ZipInfo from './ZipInfo'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

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

	it('renders the ZipInfo component with correct data', () => {
		render(<ZipInfo {...mockProps} />)

		expect(
			screen.getByText('12345, Test State, TEST COUNTRY'),
		).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<ZipInfo {...mockProps} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
