/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import SuccessModal from './success-modal'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock'))

describe('SuccessModal', () => {
	test('renders', () => {
		const isOpen = true
		const setIsOpen = jest.fn()

		render(<SuccessModal isOpen={isOpen} setIsOpen={setIsOpen} />)

		// Check if the success modal is rendered
		const successModalElement = screen.getByTestId('success-modal-1')
		expect(successModalElement).toBeInTheDocument()

		// Check if the success modal content is rendered
		const successModalContent = screen.getByTestId('success-modal-2')
		expect(successModalContent).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<SuccessModal isOpen={true} setIsOpen={() => jest.fn()} />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
