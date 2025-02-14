/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import useSWR from 'swr'
import Stats from './Stats'
import { IStats } from '../types/types'
import { axe } from 'jest-axe'

// Mock the useSWR hook
jest.mock('swr')
const mockedUseSWR = useSWR as jest.Mock

// Mock the Spinner component
// eslint-disable-next-line react/display-name
jest.mock('@/components/ui/Spinner', () => () => <div>Loading...</div>)

const mockData: IStats = {
	total_stats: {
		total_reviews: 100,
		countryStats: {
			US: { total: '50', states: [] },
			CA: { total: '20', states: [] },
			NZ: { total: '10', states: [] },
			AU: { total: '5', states: [] },
			GB: { total: '5', states: [] },
			DE: { total: '5', states: [] },
			IE: { total: '3', states: [] },
			NO: { total: '2', states: [] },
		},
	},
	detailed_stats: [
		{
			date: '2023-01-01',
			total: '10',
			country_codes: {},
			state: {},
			cities: {},
			zip: {},
		},
		{
			date: '2023-01-02',
			total: '20',
			country_codes: {},
			state: {},
			cities: {},
			zip: {},
		},
	],
}

describe('Stats Component', () => {
	it('should display loading spinner when data is not yet available', () => {
		mockedUseSWR.mockReturnValue({ data: null, error: null })
		render(<Stats />)
		expect(screen.getByText('Loading...')).toBeInTheDocument()
	})

	it('should display error message when there is an error', () => {
		mockedUseSWR.mockReturnValue({ data: null, error: true })
		render(<Stats />)
		expect(screen.getByText('failed to load')).toBeInTheDocument()
	})

	it('should display total reviews when data is available', () => {
		mockedUseSWR.mockReturnValue({ data: mockData, error: null })
		render(<Stats />)
		expect(screen.getByText('Total Reviews: 100')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<Stats />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
