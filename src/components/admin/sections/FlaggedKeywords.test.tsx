/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import '@testing-library/jest-dom'
import FlaggedKeywords from './FlaggedKeywords'
import { SWRConfig } from 'swr'
import { fetchWithBody } from '@/util/helpers/fetcher'
import { axe } from 'jest-axe'

jest.mock('@/util/helpers/fetcher')
jest.mock('react-toastify', () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}))

const mockedFetchWithBody = fetchWithBody as jest.Mock

describe('FlaggedKeywords', () => {
	beforeEach(() => {
		mockedFetchWithBody.mockImplementation(() =>
			Promise.resolve({
				keywords: [{ id: 1, keyword: 'test', reason: 'test reason' }],
			}),
		)
	})

	it('renders without crashing', async () => {
		render(
			<SWRConfig value={{ dedupingInterval: 0 }}>
				<FlaggedKeywords />
			</SWRConfig>,
		)
		expect(await screen.findByText('test')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<SWRConfig value={{ dedupingInterval: 0 }}>
				<FlaggedKeywords />
			</SWRConfig>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
