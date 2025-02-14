/**
 * @jest-environment jsdom
 */
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import SpamReviewModal from '@/components/create-review/SpamReviewModal'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('react-i18next', () => ({
	useTranslation: jest.fn().mockReturnValue({
		t: jest.fn((key) => {
			if (key === 'create-review.localStorageDetection.title') {
				return 'It appears you have reviewed this Landlord before...'
			}
			if (key === 'create-review.localStorageDetection.description') {
				return "Please only leave one review per landlord you've had so that this site can remain a fair representation of rental experiences. Any repeat reviews or spam will be deleted. If you have any questions, please reach out to us at contact@ratethelandlord.org"
			}
			if (key === 'create-review.DBDetection.title') {
				return 'We have noticed potential spam reviews related to this landlord.'
			}
			if (key === 'create-review.DBDetection.description') {
				return 'To protect the integrity of our reviews please try again later. If you have any questions, please reach out to us at contact@ratethelandlord.org'
			}
			if (key === 'create-review.modal.close') {
				return 'Close'
			}
			return ''
		}),
	}),
}))

describe('Spam Review Modal component', () => {
	test('should render the modal when isOpen is true and detectionMethod is localStorageDetection', () => {
		const setIsOpenMock = jest.fn()

		render(
			<SpamReviewModal
				isOpen={true}
				setIsOpen={setIsOpenMock}
				detectionMethod='localStorageDetection'
			/>,
		)

		// Verify that the modal is rendered
		const modalElement = screen.getByRole('dialog')
		expect(modalElement).toBeInTheDocument()

		// Verify that the modal title and description are displayed correctly
		expect(
			screen.getByText('It appears you have reviewed this Landlord before...'),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				"Please only leave one review per landlord you've had so that this site can remain a fair representation of rental experiences. Any repeat reviews or spam will be deleted. If you have any questions, please reach out to us at contact@ratethelandlord.org",
			),
		).toBeInTheDocument()

		// Verify that the close button is rendered
		const closeButton = screen.getByText('Close')
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
				setIsOpen={setIsOpenMock}
				detectionMethod='DBDetection'
			/>,
		)

		// Verify that the modal is rendered
		const modalElement = screen.getByRole('dialog')
		expect(modalElement).toBeInTheDocument()

		// Verify that the modal title and description are displayed correctly
		expect(
			screen.getByText(
				'We have noticed potential spam reviews related to this landlord.',
			),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				'To protect the integrity of our reviews please try again later. If you have any questions, please reach out to us at contact@ratethelandlord.org',
			),
		).toBeInTheDocument()

		// Verify that the close button is rendered
		const closeButton = screen.getByText('Close')
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
				setIsOpen={() => jest.fn()}
				detectionMethod='localStorageDetection'
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
