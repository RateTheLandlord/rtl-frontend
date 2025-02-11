/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RemoveFlaggedKeywordModal from './RemoveFlaggedKeywordModal'
import { Keywords } from '@/util/interfaces/interfaces'
import { toast } from 'react-toastify'
import { axe } from 'jest-axe'

jest.mock('react-toastify', () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}))

const mockHandleMutate = jest.fn()
const mockSetRemoveKeywordModalOpen = jest.fn()
const mockSetSelectedKeyword = jest.fn()

const selectedKeyword: Keywords = {
	id: 1,
	reason: 'test',
	keyword: 'test',
}

describe('RemoveFlaggedKeywordModal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders the modal correctly', () => {
		render(
			<RemoveFlaggedKeywordModal
				selectedKeyword={selectedKeyword}
				handleMutate={mockHandleMutate}
				setRemoveKeywordModalOpen={mockSetRemoveKeywordModalOpen}
				removeKeywordModalOpen={true}
				setSelectedKeyword={mockSetSelectedKeyword}
			/>,
		)

		expect(screen.getByText('Remove Landlord')).toBeInTheDocument()
		expect(
			screen.getByText(
				'Are you sure you want to remove this keyword? This cannot be undone.',
			),
		).toBeInTheDocument()
		expect(screen.getByText('Remove')).toBeInTheDocument()
		expect(screen.getByText('Cancel')).toBeInTheDocument()
	})

	it('calls the API and handles success', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
			}),
		) as jest.Mock

		render(
			<RemoveFlaggedKeywordModal
				selectedKeyword={selectedKeyword}
				handleMutate={mockHandleMutate}
				setRemoveKeywordModalOpen={mockSetRemoveKeywordModalOpen}
				removeKeywordModalOpen={true}
				setSelectedKeyword={mockSetSelectedKeyword}
			/>,
		)

		fireEvent.click(screen.getByText('Remove'))

		await waitFor(() =>
			expect(global.fetch).toHaveBeenCalledWith(
				'/api/flagged-keywords/delete-flagged-keyword',
				expect.objectContaining({
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ id: selectedKeyword.id }),
				}),
			),
		)

		await waitFor(() => expect(mockHandleMutate).toHaveBeenCalled())
		await waitFor(() =>
			expect(mockSetRemoveKeywordModalOpen).toHaveBeenCalledWith(false),
		)
		await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Success!'))
		await waitFor(() =>
			expect(mockSetSelectedKeyword).toHaveBeenCalledWith(undefined),
		)
	})

	it('handles API failure', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: false,
			}),
		) as jest.Mock

		render(
			<RemoveFlaggedKeywordModal
				selectedKeyword={selectedKeyword}
				handleMutate={mockHandleMutate}
				setRemoveKeywordModalOpen={mockSetRemoveKeywordModalOpen}
				removeKeywordModalOpen={true}
				setSelectedKeyword={mockSetSelectedKeyword}
			/>,
		)

		fireEvent.click(screen.getByText('Remove'))

		await waitFor(() =>
			expect(global.fetch).toHaveBeenCalledWith(
				'/api/flagged-keywords/delete-flagged-keyword',
				expect.objectContaining({
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ id: selectedKeyword.id }),
				}),
			),
		)

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith(
				'Failure: Something went wrong, please try again.',
			),
		)
		await waitFor(() =>
			expect(mockSetSelectedKeyword).toHaveBeenCalledWith(undefined),
		)
	})

	it('closes the modal when cancel is clicked', () => {
		render(
			<RemoveFlaggedKeywordModal
				selectedKeyword={selectedKeyword}
				handleMutate={mockHandleMutate}
				setRemoveKeywordModalOpen={mockSetRemoveKeywordModalOpen}
				removeKeywordModalOpen={true}
				setSelectedKeyword={mockSetSelectedKeyword}
			/>,
		)

		fireEvent.click(screen.getByText('Cancel'))

		expect(mockSetSelectedKeyword).toHaveBeenCalledWith(undefined)
		expect(mockSetRemoveKeywordModalOpen).toHaveBeenCalledWith(false)
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<RemoveFlaggedKeywordModal
				selectedKeyword={selectedKeyword}
				handleMutate={mockHandleMutate}
				setRemoveKeywordModalOpen={mockSetRemoveKeywordModalOpen}
				removeKeywordModalOpen={true}
				setSelectedKeyword={mockSetSelectedKeyword}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
