/**
 * @jest-environment jsdom
 */

import { render, screen } from '@/test-utils'
import MapComponent from './Map'
import { Options } from '@/util/interfaces/interfaces'
import { useRouter } from 'next/router'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

const mockUseRouter = useRouter as jest.Mock

describe('MapComponent', () => {
	const countryFilter: Options = { id: 1, name: 'Canada', value: 'CA' }
	const stateFilter: Options = { id: 2, name: 'Ontario', value: 'ON' }

	beforeEach(() => {
		mockUseRouter.mockReturnValue({
			query: {},
			isReady: true,
		})
	})

	it('renders without crashing', () => {
		render(
			<MapComponent countryFilter={countryFilter} stateFilter={stateFilter} />,
		)
		expect(screen.getByTestId('map-component')).toBeInTheDocument()
	})

	it('displays "Not Available" message for unsupported countries', () => {
		const unsupportedCountry: Options = { id: 3, name: 'France', value: 'FR' }
		render(
			<MapComponent
				countryFilter={unsupportedCountry}
				stateFilter={stateFilter}
			/>,
		)
		expect(screen.getByText('Not Available')).toBeInTheDocument()
	})

	it('does not display "Not Available" message for supported countries', () => {
		render(
			<MapComponent countryFilter={countryFilter} stateFilter={stateFilter} />,
		)
		expect(screen.queryByText('Not Available')).not.toBeInTheDocument()
	})

	it('sets selectedPoint to null if currAffiliate is not set', () => {
		render(
			<MapComponent countryFilter={countryFilter} stateFilter={stateFilter} />,
		)
		expect(screen.queryByText('Information')).not.toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<MapComponent countryFilter={countryFilter} stateFilter={stateFilter} />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
