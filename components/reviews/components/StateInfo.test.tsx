/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import StateInfo from './StateInfo'
import { useAppDispatch } from '@/redux/hooks'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('@/redux/hooks', () => ({
	useAppDispatch: jest.fn(),
}))

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

jest.mock('swr', () => jest.fn())

jest.mock('@/components/city/CitiesTable', () =>
	jest.fn(() => <div>CitiesTable</div>),
)

describe('StateInfo', () => {
	const mockDispatch = jest.fn()
	const mockRouterPush = jest.fn()
	const mockSetLocationOpen = jest.fn()

	beforeEach(() => {
		;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
		;(useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush })
	})

	it('renders state and country information correctly', () => {
		;(useSWR as jest.Mock).mockReturnValue({
			data: {
				total: '100',
				catAverages: {
					avg_repair: 2,
					avg_health: 2,
					avg_stability: 2,
					avg_respect: 2,
					acg_privacy: 2,
				},
				average: 2,
			},
			error: null,
		})
		render(
			<StateInfo
				state='california'
				country='us'
				setLocationOpen={mockSetLocationOpen}
			/>,
		)
		expect(screen.getByText('California, US')).toBeInTheDocument()
		expect(screen.getByText('landlord.rental-experience')).toBeInTheDocument()
	})
	it('renders Spinner when data is not available', () => {
		;(useSWR as jest.Mock).mockReturnValue({ data: null, error: null })
		render(
			<StateInfo
				state='california'
				country='us'
				setLocationOpen={mockSetLocationOpen}
			/>,
		)
		expect(screen.getByRole('status')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<StateInfo
				state='california'
				country='us'
				setLocationOpen={mockSetLocationOpen}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
