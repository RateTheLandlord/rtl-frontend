/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@/test-utils'
import '@testing-library/jest-dom'
import RemoveSuspiciousLandlord from './RemoveSuspiciousLandlordModal'
import { SuspiciousLandlord } from '@/util/interfaces/interfaces'
import { axe } from 'jest-axe'

const mockHandleMutate = jest.fn()
const mockSetRemoveSuspiciousLandlordOpen = jest.fn()
const mockSetSelectedSuspiciousLandlord = jest.fn()

const mockLandlord: SuspiciousLandlord = {
	id: 1,
	landlord: 'John Doe',
	message: 'test',
}

describe('RemoveSuspiciousLandlord', () => {
	it('renders the modal when removeSuspiciousLandlordOpen is true', () => {
		render(
			<RemoveSuspiciousLandlord
				selectedLandlord={mockLandlord}
				handleMutate={mockHandleMutate}
				setRemoveSuspiciousLandlordOpen={mockSetRemoveSuspiciousLandlordOpen}
				removeSuspiciousLandlordOpen={true}
				setSelectedSuspiciousLandlord={mockSetSelectedSuspiciousLandlord}
			/>,
		)

		expect(screen.getByText('Remove Landlord')).toBeInTheDocument()
		expect(
			screen.getByText(
				"Are you sure you want to remove this landlord's message? This cannot be undone.",
			),
		).toBeInTheDocument()
	})

	it('does not render the modal when removeSuspiciousLandlordOpen is false', () => {
		render(
			<RemoveSuspiciousLandlord
				selectedLandlord={mockLandlord}
				handleMutate={mockHandleMutate}
				setRemoveSuspiciousLandlordOpen={mockSetRemoveSuspiciousLandlordOpen}
				removeSuspiciousLandlordOpen={false}
				setSelectedSuspiciousLandlord={mockSetSelectedSuspiciousLandlord}
			/>,
		)

		expect(screen.queryByText('Remove Landlord')).not.toBeInTheDocument()
	})

	it('calls setRemoveSuspiciousLandlordOpen with false when cancel button is clicked', () => {
		render(
			<RemoveSuspiciousLandlord
				selectedLandlord={mockLandlord}
				handleMutate={mockHandleMutate}
				setRemoveSuspiciousLandlordOpen={mockSetRemoveSuspiciousLandlordOpen}
				removeSuspiciousLandlordOpen={true}
				setSelectedSuspiciousLandlord={mockSetSelectedSuspiciousLandlord}
			/>,
		)

		fireEvent.click(screen.getByText('Cancel'))
		expect(mockSetRemoveSuspiciousLandlordOpen).toHaveBeenCalledWith(false)
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<RemoveSuspiciousLandlord
				selectedLandlord={mockLandlord}
				handleMutate={mockHandleMutate}
				setRemoveSuspiciousLandlordOpen={mockSetRemoveSuspiciousLandlordOpen}
				removeSuspiciousLandlordOpen={true}
				setSelectedSuspiciousLandlord={mockSetSelectedSuspiciousLandlord}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
