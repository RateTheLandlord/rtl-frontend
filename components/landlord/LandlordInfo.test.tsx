/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import LandlordInfo from './LandlordInfo'
import { useRouter } from 'next/router'
import { ILandlordReviews } from '@/lib/review/review'

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

describe('LandlordInfo', () => {
	const pushMock = jest.fn()

	beforeEach(() => {
		return (useRouter as jest.Mock).mockImplementation(() => ({
			push: pushMock,
		}))
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('renders with correct name, average, and total', () => {
		const name = 'John Doe'
		const data: ILandlordReviews = {
			reviews: [],
			average: 5,
			total: 5,
			otherLandlords: [],
			catAverages: {
				avg_health: 5,
				avg_privacy: 5,
				avg_repair: 5,
				avg_respect: 5,
				avg_stability: 5,
			},
		}

		render(<LandlordInfo name={name} data={data} />)

		const landlordName = screen.getByText(name)
		const reviewCount = screen.getByText(`Based on ${data.total} reviews`)

		expect(landlordName).toBeInTheDocument()
		expect(reviewCount).toBeInTheDocument()
	})
})
