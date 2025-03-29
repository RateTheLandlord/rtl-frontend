/**
 * @jest-environment jsdom
 */
import React from 'react'
import { fireEvent, render, screen } from '@/test-utils'
import SpamReviewModal from '@/components/create-review/SpamReviewModal'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Spam Review Modal component', () => {
	test('should render the modal when isOpen is true and detectionMethod is localStorageDetection', () => {
		const setIsOpenMock = jest.fn()

		render(
			<SpamReviewModal
				isOpen={true}
				landlord=''
				setIsOpen={setIsOpenMock}
				detectionMethod='localStorageDetection'
			/>,
		)

		// Verify that the modal is rendered
		const modalElement = screen.getByRole('dialog')
		expect(modalElement).toBeInTheDocument()

		// Verify that the modal title and description are displayed correctly
		expect(
			screen.getByText('createreview.localStorageDetection.title'),
		).toBeInTheDocument()
		expect(
			screen.getByText('createreview.localStorageDetection.description'),
		).toBeInTheDocument()

		// Verify that the close button is rendered
		const closeButton = screen.getByText('createreview.modal.close')
		expect(closeButton).toBeInTheDocument()

		// Simulate clicking the close button
		fireEvent.click(closeButton)

		// Verify that the setIsOpen function is called with false when the close button is clicked
		expect(setIsOpenMock).toHaveBeenCalledWith(false)
	})

	test('should render the modal when isOpen is true and detectionMethod is DBDetection', () => {
		const setIsOpenMock = jest.fn()

		render(
			<SpamReviewModal
				isOpen={true}
				landlord=''
				setIsOpen={setIsOpenMock}
				detectionMethod='DBDetection'
			/>,
		)

		// Verify that the modal is rendered
		const modalElement = screen.getByRole('dialog')
		expect(modalElement).toBeInTheDocument()

		// Verify that the modal title and description are displayed correctly
		expect(
			screen.getByText('createreview.DBDetection.title'),
		).toBeInTheDocument()
		expect(
			screen.getByText('createreview.DBDetection.description'),
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

		render(
			<SpamReviewModal
				isOpen={false}
				landlord=''
				setIsOpen={setIsOpenMock}
				detectionMethod='localStorageDetection'
			/>,
		)

		// Verify that the modal is not rendered
		const modalElement = screen.queryByRole('dialog')
		expect(modalElement).toBeNull()

		// Verify that the setIsOpen function is not called when the component is not rendered
		expect(setIsOpenMock).not.toHaveBeenCalled()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<SpamReviewModal
				isOpen={true}
				landlord=''
				setIsOpen={() => jest.fn()}
				detectionMethod='localStorageDetection'
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
