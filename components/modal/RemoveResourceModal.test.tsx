/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import RemoveResourceModal from './RemoveResourceModal'
import { toast } from 'react-toastify'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Resource } from '@/util/interfaces/interfaces'
expect.extend(toHaveNoViolations)

jest.mock('react-toastify', () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}))

const mockHandleMutate = jest.fn()
const mockSetRemoveResourceOpen = jest.fn()
const mockSetSelectedResource = jest.fn()

const selectedResource: Resource = {
	id: 1,
	name: 'Test Resource',
	country_code: 'CA',
	city: 'Test City',
	state: 'Test State',
	address: '123 Test St',
	phone_number: '123-456-7890',
	description: 'Test Description',
	href: 'http://test.com',
	date_added: new Date(),
}

describe('RemoveResourceModal', () => {
	it('renders the modal correctly', () => {
		render(
			<RemoveResourceModal
				selectedResource={selectedResource}
				handleMutate={mockHandleMutate}
				setRemoveResourceOpen={mockSetRemoveResourceOpen}
				removeResourceOpen={true}
				setSelectedResource={mockSetSelectedResource}
			/>,
		)

		expect(screen.getByText('Remove Resource')).toBeInTheDocument()
		expect(
			screen.getByText(
				'Are you sure you want to remove this resource? This cannot be undone.',
			),
		).toBeInTheDocument()
	})

	it('calls handleMutate and closes the modal on successful resource removal', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
			}),
		) as jest.Mock

		render(
			<RemoveResourceModal
				selectedResource={selectedResource}
				handleMutate={mockHandleMutate}
				setRemoveResourceOpen={mockSetRemoveResourceOpen}
				removeResourceOpen={true}
				setSelectedResource={mockSetSelectedResource}
			/>,
		)

		fireEvent.click(screen.getByText('Remove'))

		await waitFor(() => expect(mockHandleMutate).toHaveBeenCalled())
		expect(mockSetRemoveResourceOpen).toHaveBeenCalledWith(false)
		expect(toast.success).toHaveBeenCalledWith('Success!')
		expect(mockSetSelectedResource).toHaveBeenCalledWith(undefined)
	})

	it('shows an error toast on failed resource removal', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: false,
			}),
		) as jest.Mock

		render(
			<RemoveResourceModal
				selectedResource={selectedResource}
				handleMutate={mockHandleMutate}
				setRemoveResourceOpen={mockSetRemoveResourceOpen}
				removeResourceOpen={true}
				setSelectedResource={mockSetSelectedResource}
			/>,
		)

		fireEvent.click(screen.getByText('Remove'))

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith(
				'Failure: Something went wrong, please try again.',
			),
		)
		expect(mockSetSelectedResource).toHaveBeenCalledWith(undefined)
	})

	it('closes the modal when cancel button is clicked', () => {
		render(
			<RemoveResourceModal
				selectedResource={selectedResource}
				handleMutate={mockHandleMutate}
				setRemoveResourceOpen={mockSetRemoveResourceOpen}
				removeResourceOpen={true}
				setSelectedResource={mockSetSelectedResource}
			/>,
		)

		fireEvent.click(screen.getByText('Cancel'))

		expect(mockSetRemoveResourceOpen).toHaveBeenCalledWith(false)
		expect(mockSetSelectedResource).toHaveBeenCalledWith(undefined)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<RemoveResourceModal
				selectedResource={selectedResource}
				handleMutate={mockHandleMutate}
				setRemoveResourceOpen={mockSetRemoveResourceOpen}
				removeResourceOpen={true}
				setSelectedResource={mockSetSelectedResource}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
