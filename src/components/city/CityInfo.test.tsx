/**
 * @jest-environment jsdom
 */
import { render } from '@/test-utils'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import CityInfo from './CityInfo'
expect.extend(toHaveNoViolations)

describe('CityInfo Component', () => {
	const mockProps = {
		city: 'Toronto',
		state: 'Ontario',
		country: 'Canada',
		average: 4.2,
		total: 120,
		averages: {
			avg_repair: 3.5,
			avg_health: 4.0,
			avg_stability: 2.5,
			avg_privacy: 3.0,
			avg_respect: 4.5,
		},
	}
	it('Should not have a11y violation', async () => {
		const { container } = render(<CityInfo {...mockProps} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
