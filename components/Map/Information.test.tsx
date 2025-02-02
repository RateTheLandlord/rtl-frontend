/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Information from './Information'
import useSWR from 'swr'
import { IZipLocations } from '@/lib/location/location'
import { Options } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('swr')
jest.mock('../ui/Spinner', () => () => <div>Loading...</div>)
jest.mock('../ui/RatingStars', () => ({ value }: { value: number }) => (
	<div data-testid='mapratings'>{value}</div>
))

const mockUseSWR = useSWR as jest.Mock

const selectedPoint: IZipLocations = {
	zip: '12345',
	latitude: '0',
	longitude: '0',
}

const country: Options = {
	id: 1,
	name: 'Country',
	value: 'country-code',
}

const state: Options = {
	id: 2,
	name: 'State',
	value: 'state-code',
}

describe('Information Component', () => {
	it('renders loading spinner when data is not yet available', () => {
		mockUseSWR.mockReturnValue({ data: null, error: null })
		render(
			<Information
				selectedPoint={selectedPoint}
				country={country}
				state={state}
			/>,
		)
		expect(screen.getByText('Loading...')).toBeInTheDocument()
	})

	it('renders error message when there is an error', () => {
		mockUseSWR.mockReturnValue({ data: {}, error: true })
		render(
			<Information
				selectedPoint={selectedPoint}
				country={country}
				state={state}
			/>,
		)
		expect(
			screen.getByText(
				'Sorry, we seem to have run into a small error. Please try again.',
			),
		).toBeInTheDocument()
	})

	it('renders postal code, total reviews, average rating, and view reviews link when data is available', () => {
		const stats = { total: 10, average: 4.5 }
		mockUseSWR.mockReturnValue({ data: stats, error: null })
		render(
			<Information
				selectedPoint={selectedPoint}
				country={country}
				state={state}
			/>,
		)

		expect(screen.getByText('Postal Code')).toBeInTheDocument()
		expect(screen.getByText('12345')).toBeInTheDocument()
		expect(screen.getByText('Total Reviews')).toBeInTheDocument()
		expect(screen.getByText('10')).toBeInTheDocument()
		expect(screen.getByTestId('mapratings')).toHaveTextContent('4.5')
		expect(screen.getByText('View Reviews')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Information
				selectedPoint={selectedPoint}
				country={country}
				state={state}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
