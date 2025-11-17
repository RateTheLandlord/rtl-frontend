/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

import SuccessModal from './success-modal'

describe('SuccessModal', () => {
	test('renders', () => {
		render(<SuccessModal />)

		// Check if the success modal is rendered
		const successModalElement = screen.getByTestId('SuccessModalComponent')
		expect(successModalElement).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<SuccessModal />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
