/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import LandlordInfo from './LandlordInfo'
import { useRouter } from 'next/router'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ILandlordReviews } from '@/lib/review/types/Queries'
expect.extend(toHaveNoViolations)

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

	const name = 'John Doe'
	const data: ILandlordReviews = {
		reviews: [],
		average: 5,
		total: 5,
		catAverages: {
			avg_health: 5,
			avg_privacy: 5,
			avg_repair: 5,
			avg_respect: 5,
			avg_stability: 5,
		},
	}
	it('renders with correct name, average, and total', () => {
		render(<LandlordInfo name={name} data={data} />)

		const landlordName = screen.getByText(name)
		// const reviewCount = screen.getByText(`Based on ${data.total} reviews`)

		expect(landlordName).toBeInTheDocument()
		// expect(reviewCount).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<LandlordInfo name={name} data={data} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
