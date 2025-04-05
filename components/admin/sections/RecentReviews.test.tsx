/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import RecentReviews from './RecentReviews'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { axe } from 'jest-axe'

// Mock useSWR
jest.mock('swr')
const mockedUseSWR = useSWR as jest.Mock

describe('RecentReviews Component', () => {
	it('renders error message when there is an error', () => {
		mockedUseSWR.mockReturnValue({ data: null, error: true })
		render(<RecentReviews />)
		expect(screen.getByText('Error Loading...')).toBeInTheDocument()
	})

	it('renders the list of recent reviews when data is available', () => {
		const mockData = [
			{ id: '1', landlord: 'John Doe', created_at: '2023-01-01T12:00:00Z' },
			{ id: '2', landlord: 'Jane Smith', created_at: '2023-01-02T15:30:00Z' },
		]
		mockedUseSWR.mockReturnValue({ data: mockData, error: null })
		render(<RecentReviews />)

		mockData.forEach((item, index) => {
			expect(screen.getByText(index + 1)).toBeInTheDocument()
			expect(screen.getByText(item.landlord)).toBeInTheDocument()
			expect(
				screen.getByText(dayjs(item.created_at).format('DD/MM/YYYY HH:mm:ss')),
			).toBeInTheDocument()
		})
	})

	it('Should not have a11y violation', async () => {
		;(useSWR as jest.Mock).mockReturnValue({
			data: [],
			error: null,
		})
		const { container } = render(<RecentReviews />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
