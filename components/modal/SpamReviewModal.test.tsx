/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import SpamReviewModal from '@/components/modal/SpamReviewModal'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Spam Review Modal component', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(<SpamReviewModal />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
