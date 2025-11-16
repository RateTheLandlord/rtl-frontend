/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import EditSuspiciousLandlordModal from './EditSuspiciousLandlordModal'
import { SuspiciousLandlord } from '@/util/interfaces/interfaces'
import { toast } from 'react-toastify'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('react-toastify', () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}))

const mockHandleMutate = jest.fn()
const mockSetEditSuspiciousLandlordOpen = jest.fn()
const mockSetSelectedSuspiciousLandlord = jest.fn()

const suspiciousLandlord: SuspiciousLandlord = {
	id: 1,
	landlord: 'John Doe',
	message: 'Suspicious activity',
}

describe('EditSuspiciousLandlordModal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders the modal with initial values', () => {
		render(
			<EditSuspiciousLandlordModal
				selectedSuspiciousLandlord={suspiciousLandlord}
				handleMutate={mockHandleMutate}
				setEditSuspiciousLandlordOpen={mockSetEditSuspiciousLandlordOpen}
				editSuspiciousLandlordOpen={true}
				setSelectedSuspiciousLandlord={mockSetSelectedSuspiciousLandlord}
			/>,
		)

		expect(screen.getByPlaceholderText('Landlord')).toHaveValue('John Doe')
	})

	it('calls onSubmitEditResource and handles failure', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: false,
			}),
		) as jest.Mock

		render(
			<EditSuspiciousLandlordModal
				selectedSuspiciousLandlord={suspiciousLandlord}
				handleMutate={mockHandleMutate}
				setEditSuspiciousLandlordOpen={mockSetEditSuspiciousLandlordOpen}
				editSuspiciousLandlordOpen={true}
				setSelectedSuspiciousLandlord={mockSetSelectedSuspiciousLandlord}
			/>,
		)

		fireEvent.click(screen.getByText('Submit'))

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				'Failure: Something went wrong, please try again.',
			)
			expect(mockSetSelectedSuspiciousLandlord).toHaveBeenCalledWith(undefined)
		})
	})

	it('calls setEditSuspiciousLandlordOpen and setSelectedSuspiciousLandlord on cancel', () => {
		render(
			<EditSuspiciousLandlordModal
				selectedSuspiciousLandlord={suspiciousLandlord}
				handleMutate={mockHandleMutate}
				setEditSuspiciousLandlordOpen={mockSetEditSuspiciousLandlordOpen}
				editSuspiciousLandlordOpen={true}
				setSelectedSuspiciousLandlord={mockSetSelectedSuspiciousLandlord}
			/>,
		)

		fireEvent.click(screen.getByText('Cancel'))

		expect(mockSetEditSuspiciousLandlordOpen).toHaveBeenCalledWith(false)
		expect(mockSetSelectedSuspiciousLandlord).toHaveBeenCalledWith(undefined)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<EditSuspiciousLandlordModal
				selectedSuspiciousLandlord={suspiciousLandlord}
				handleMutate={mockHandleMutate}
				setEditSuspiciousLandlordOpen={mockSetEditSuspiciousLandlordOpen}
				editSuspiciousLandlordOpen={true}
				setSelectedSuspiciousLandlord={mockSetSelectedSuspiciousLandlord}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
