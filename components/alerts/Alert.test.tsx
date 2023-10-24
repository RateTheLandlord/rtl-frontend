/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import Alert from './Alert'

describe('Alert Component', () => {
	test('renders success alert', () => {
		const mockSetAlertOpen = jest.fn()

		render(<Alert success={true} setAlertOpen={mockSetAlertOpen} />)
		expect(screen.getByText('Success!')).toBeInTheDocument()
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	test('renders failure alert', () => {
		const mockSetAlertOpen = jest.fn()

		render(<Alert success={false} setAlertOpen={mockSetAlertOpen} />)
		expect(
			screen.getByText('Failure: Something went wrong, please try again.'),
		).toBeInTheDocument()
		expect(screen.getByRole('button')).toBeInTheDocument()
	})
})
