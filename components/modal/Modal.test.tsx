/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Modal', () => {
	const mockSetOpen = jest.fn()
	const mockOnSubmit = jest.fn()
	const mockElement = <div>Mock Element</div>
	it('renders the component with the correct content', () => {
		render(
			<Modal
				open={true}
				setOpen={mockSetOpen}
				title='Modal Title'
				description='Modal Description'
				element={mockElement}
				onSubmit={mockOnSubmit}
				selectedId={1}
				loading={false}
			/>,
		)

		const modalElement = screen.getByTestId('modal-1')
		expect(modalElement).toBeInTheDocument()

		const titleElement = screen.getByRole('heading', { level: 3 })
		expect(titleElement).toHaveTextContent('Modal Title')

		const descriptionElement = screen.getByText('Modal Description')
		expect(descriptionElement).toBeInTheDocument()

		const submitButton = screen.getByText('Submit')
		expect(submitButton).toBeInTheDocument()

		const cancelButton = screen.getByText('Cancel')
		expect(cancelButton).toBeInTheDocument()

		fireEvent.click(submitButton)
		expect(mockOnSubmit).toHaveBeenCalledTimes(1)
		expect(mockOnSubmit).toHaveBeenCalledWith(1)

		fireEvent.click(cancelButton)
		expect(mockSetOpen).toHaveBeenCalledTimes(1)
		expect(mockSetOpen).toHaveBeenCalledWith(false)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Modal
				open={true}
				setOpen={mockSetOpen}
				title='Modal Title'
				description='Modal Description'
				element={mockElement}
				onSubmit={mockOnSubmit}
				selectedId={1}
				loading={false}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
