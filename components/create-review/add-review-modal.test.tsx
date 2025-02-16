/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import AddReviewModal from './add-review-modal'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('react-i18next', () => ({
	useTranslations: jest.fn().mockReturnValue({
		t: jest.fn((key) => {
			if (key === 'create-review.modal.add-review') {
				return 'Add Review'
			}
			if (key === 'create-review.modal.add-review-desc') {
				return 'Please provide your review.'
			}
			if (key === 'create-review.modal.close') {
				return 'Close'
			}
			return ''
		}),
	}),
}))

describe('AddReviewModal component', () => {
	test('should render the modal when isOpen is true', () => {
		const setIsOpenMock = jest.fn()

		render(<AddReviewModal isOpen={true} setIsOpen={setIsOpenMock} />)

		// Verify that the modal is rendered
		const modalElement = screen.getByRole('dialog')
		expect(modalElement).toBeInTheDocument()

		// Verify that the modal title and description are displayed correctly
		expect(
			screen.getByText('createreview.modal.add-review'),
		).toBeInTheDocument()
		expect(
			screen.getByText('createreview.modal.add-review-desc'),
		).toBeInTheDocument()

		// Verify that the close button is rendered
		const closeButton = screen.getByText('createreview.modal.close')
		expect(closeButton).toBeInTheDocument()

		// Simulate clicking the close button
		fireEvent.click(closeButton)

		// Verify that the setIsOpen function is called with false when the close button is clicked
		expect(setIsOpenMock).toHaveBeenCalledWith(false)
	})

	test('should not render the modal when isOpen is false', () => {
		const setIsOpenMock = jest.fn()

		render(<AddReviewModal isOpen={false} setIsOpen={setIsOpenMock} />)

		// Verify that the modal is not rendered
		const modalElement = screen.queryByRole('dialog')
		expect(modalElement).toBeNull()

		// Verify that the setIsOpen function is not called when the component is not rendered
		expect(setIsOpenMock).not.toHaveBeenCalled()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<AddReviewModal isOpen={true} setIsOpen={() => jest.fn()} />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
