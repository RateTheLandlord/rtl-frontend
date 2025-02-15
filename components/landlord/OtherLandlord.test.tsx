/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import OtherLandlordInfo from './OtherLandlord'
import useSWR from 'swr'
import { OtherLandlord } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

// Mock the useSWR hook
jest.mock('swr')

const mockLandlords: OtherLandlord[] = [
	{
		name: 'Landlord A',
		topcity: 'City A',
		reviewcount: 10,
		avgrating: 4.5,
	},
	{
		name: 'Landlord B',
		topcity: 'City B',
		reviewcount: 5,
		avgrating: 3.8,
	},
]

describe('OtherLandlordInfo', () => {
	it('renders a spinner while loading', () => {
		;(useSWR as jest.Mock).mockReturnValue({ data: null, error: null })
		render(<OtherLandlordInfo landlord='test-landlord' />)
		expect(screen.getByRole('status')).toBeInTheDocument()
	})

	it('renders null if there are no landlords', () => {
		;(useSWR as jest.Mock).mockReturnValue({ data: [], error: null })
		const { container } = render(<OtherLandlordInfo landlord='test-landlord' />)
		expect(container).toBeEmptyDOMElement()
	})

	it('renders landlords correctly', () => {
		;(useSWR as jest.Mock).mockReturnValue({ data: mockLandlords, error: null })
		render(<OtherLandlordInfo landlord='test-landlord' />)
		expect(
			screen.getByText('View Other Landlords in City A:'),
		).toBeInTheDocument()
		expect(screen.getByText('Landlord A')).toBeInTheDocument()
		expect(screen.getByText('Read 10 review(s)')).toBeInTheDocument()
		expect(screen.getByText('Landlord B')).toBeInTheDocument()
		expect(screen.getByText('Read 5 review(s)')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<OtherLandlordInfo landlord='test-landlord' />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
