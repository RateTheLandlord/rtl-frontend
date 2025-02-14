/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import useSWR from 'swr'
import { axe } from 'jest-axe'
import FlaggedReviews from './FlaggedReviews'

jest.mock('swr')
jest.mock('@/components/ui/Spinner', () => <div>Loading...</div>)

describe('FlaggedReviews', () => {
	;(useSWR as jest.Mock).mockReturnValue({
		data: [],
		error: null,
	})
	it('renders', () => {
		render(<FlaggedReviews />)

		expect(screen.getByTestId('flagged-reviews')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		;(useSWR as jest.Mock).mockReturnValue({
			data: [],
			error: null,
		})
		const { container } = render(<FlaggedReviews />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
