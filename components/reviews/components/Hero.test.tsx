/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import '@testing-library/jest-dom'
import Hero from './Hero'
import { Options } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Hero Component', () => {
	const countryFilter: Options = { value: 'US', id: 1, name: 'United States' }
	const stateFilter: Options = { value: 'CA', id: 2, name: 'California' }

	it('renders without crashing', () => {
		render(<Hero countryFilter={countryFilter} stateFilter={stateFilter} />)
		expect(screen.getByTestId('submit-button-1')).toBeInTheDocument()
	})

	it('enables the button if both country and state are selected', () => {
		render(<Hero countryFilter={countryFilter} stateFilter={stateFilter} />)
		const button = screen.getByTestId('submit-button-1')
		expect(button).toBeEnabled()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Hero countryFilter={countryFilter} stateFilter={stateFilter} />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
