/**
 * @jest-environment jsdom
 */
import { render, fireEvent, screen } from '@/test-utils'
import MaliciousStringAlert from './MaliciousStringAlert'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('MaliciousStringAlert Component', () => {
	test('renders correctly', () => {
		const mockSetMaliciousAlertOpen = jest.fn()

		render(
			<MaliciousStringAlert
				setMaliciousAlertOpen={mockSetMaliciousAlertOpen}
			/>,
		)
		expect(screen.getByTestId('alert-1')).toBeInTheDocument()
	})

	test('displays alert text', () => {
		const mockSetMaliciousAlertOpen = jest.fn()

		render(
			<MaliciousStringAlert
				setMaliciousAlertOpen={mockSetMaliciousAlertOpen}
			/>,
		)
		expect(screen.getByText('alerts.maliciousString')).toBeInTheDocument()
	})

	test('has dismiss button with correct role', () => {
		const mockSetMaliciousAlertOpen = jest.fn()

		render(
			<MaliciousStringAlert
				setMaliciousAlertOpen={mockSetMaliciousAlertOpen}
			/>,
		)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	test('calls setMaliciousAlertOpen on dismiss button click', () => {
		const mockSetMaliciousAlertOpen = jest.fn()

		render(
			<MaliciousStringAlert
				setMaliciousAlertOpen={mockSetMaliciousAlertOpen}
			/>,
		)
		fireEvent.click(screen.getByRole('button'))
		expect(mockSetMaliciousAlertOpen).toHaveBeenCalled()
		expect(mockSetMaliciousAlertOpen).toHaveBeenCalledWith(expect.any(Function))
	})

	it('Should not have a11y violation', async () => {
		const mockSetMaliciousAlertOpen = jest.fn()
		const { container } = render(
			<MaliciousStringAlert
				setMaliciousAlertOpen={mockSetMaliciousAlertOpen}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
